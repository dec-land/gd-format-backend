export default class BaseError extends Error {
  public status: number;

  public detail: unknown;

  constructor(
    message = "Internal server error",
    detail?: unknown,
    status = 500
  ) {
    super(message);
    this.name = "Error";
    this.status = status;
    this.detail = detail;
  }

  public toJSON(): unknown {
    return {
      error: this.name,
      message: this.message,
      detail: this.detail ?? "",
    };
  }
}
