import { Router, Request, Response, NextFunction } from "express";
import { MemberService } from "../service/MemberService";
import { SignUpRequest } from "../dto/SignUpRequest";

export class MemberController {
  readonly router = Router();

  constructor(private readonly memberService: MemberService) {
    this.router.post("/signup", this.signup.bind(this));
  }

  private async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as SignUpRequest;
      res.json(await this.memberService.signup(body));
    } catch (e) {
      next(e);
    }
  }
}
