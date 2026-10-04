import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "../service/AuthService";

export class AuthController {
  readonly router = Router();

  constructor(private readonly authService: AuthService) {
    this.router.post("/login", this.login.bind(this));
    this.router.post("/logout", this.logout.bind(this));
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await this.authService.login(req.body.username, req.body.password));
    } catch (e) {
      next(e);
    }
  }

  private async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await this.authService.logout(req.body.refreshToken);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
