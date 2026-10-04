import { CustomException } from "./CustomException";

export class TokenException extends CustomException {
  constructor(message: string) {
    super(401, message);
  }
}
