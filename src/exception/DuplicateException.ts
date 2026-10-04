import { CustomException } from "./CustomException";

export class DuplicateException extends CustomException {
  constructor(message: string) {
    super(409, message);
  }
}
