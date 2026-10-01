import { Router, Request, Response } from "express";
import { AuthService } from "../service/AuthService";


export class AuthController {
    readonly router = Router();

    constructor(private readonly authService: AuthService) {
        this.router.post("/login", this.login.bind(this))
        this.router.post("/logout", this.logout.bind(this))

    }

    private async login(req: Request, res: Response) {
        res.json(this.authService.login(req.body.username, req.body.password));
    }
    
    private async logout(req: Request, res: Response) { 
        await this.authService.logout(req.body.refreshToken) 
        res.status(204).send();
    }
}