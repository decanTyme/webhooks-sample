class LockCapabilityError extends Error {
  public constructor(id: string) {
    const message = `SeamService Error: Device with ID: ${id} has no lock capability`;

    super(message);
    this.name = "LockCapabilityError";
  }
}

export default LockCapabilityError;
