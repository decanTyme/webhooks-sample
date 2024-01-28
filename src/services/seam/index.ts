import Constants from "@constants";
import type { Webview } from "@types";
import { Seam, SeamActionAttemptError } from "seamapi";
import LockCapabilityError from "./LockCapabilityError";

class SeamService {
  private readonly seam = new Seam();
  private initialized = false;
  private providers: string[] = [];

  // for its purposes, we only make sure at least one sandbox
  // account is connected, so we get some test devices.
  public async init(providers: string[]): Promise<void> {
    this.providers = providers;

    const webviewId = await this.resolveWebviewId();

    const webview = await this.seam.connectWebviews.get(webviewId);
    this.initialized =
      webview.status === "authorized" && webview.login_successful;

    if (webview.status === "pending") {
      console.info(
        `SeamService: Webview with ID "${webviewId}" is pending authorization.
        Please clink the link below to proceed:
        
        ${webview.url}\n`
      );
    } else if (!webview.login_successful) {
      throw new Error("SeamService: Failed to authenticate.");
    }
  }

  public async checkLockCapability(deviceId: string): Promise<boolean> {
    const device = await this.seam.locks.get(deviceId);

    if (!device.properties.online) {
      throw new Error("SeamService: Device not online.", {
        cause: Constants.DEVICE_NOT_ONLINE,
      });
    }

    return device.capabilities_supported.includes("lock");
  }

  public async setLock(deviceId: string, value: boolean): Promise<void> {
    if (!this.initialized) {
      await this.init(this.providers);
      return;
    }

    const isLockable = await this.checkLockCapability(deviceId);

    if (!isLockable) {
      throw new LockCapabilityError(deviceId);
    }

    let action: Awaited<ReturnType<typeof this.seam.locks.lockDoor>>; // or `unlockDoor`

    // eslint-disable-next-line unicorn/prefer-ternary
    if (value) {
      action = await this.seam.locks.lockDoor(deviceId);
    } else {
      action = await this.seam.locks.unlockDoor(deviceId);
    }

    const { actionAttempt } = action;

    if (actionAttempt.error) {
      const { action_type, error } = actionAttempt;

      throw new SeamActionAttemptError(error.type, error.message, action_type);
    }
  }

  public async lockDevice(id: string): Promise<void> {
    await this.setLock(id, true);
  }

  public async unlockDevice(id: string): Promise<void> {
    await this.setLock(id, false);
  }

  private async createWebview(): Promise<Webview> {
    const webview = await this.seam.connectWebviews.create({
      accepted_providers: this.providers,
      wait_for_device_creation: true,
    });

    return webview;
  }

  private async resolveWebviewId(): Promise<string> {
    const webviews = await this.seam.connectWebviews.list();

    const { connect_webview_id } =
      webviews.length === 0 ? await this.createWebview() : webviews[0];

    return connect_webview_id;
  }
}

export default new SeamService();
