import { CustomException } from "./CustomException";

export class UnauthorizedException extends CustomException {
  constructor(message: string) {
    super(401, message);
  }
}
