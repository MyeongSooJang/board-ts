import { CustomException } from "./CustomException";

export class ValidationException extends CustomException {
  constructor(message: string) {
    super(400, message);
  }
}
