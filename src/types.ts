import type Seam from "seamapi";

export type Maybe<T> = T | undefined;

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export interface Reservation {
  device: MockDeviceSetStatus;
}

interface MockDeviceSetStatus {
  id: string;
  lock: boolean;
}

type SeamInstance = InstanceType<typeof Seam>;

export type Webview = Awaited<
  ReturnType<SeamInstance["connectWebviews"]["create"]>
>;
