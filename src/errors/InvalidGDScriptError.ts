import BaseError from "./BaseError";

export default class InvalidGDScriptError extends BaseError {
  constructor(
    message = 'Code provided is not valid GDScript',
    detail?: unknown,
    status: number = 422
  ) {
    super(message, detail, status);
    this.name = "Unprocessable";
  }
}
