import { Router, Request, Response } from "express";
import { MemberService } from "../service/MemberService";
import { SignUpRequest } from "../dto/SignUpRequest";


export class MemberController {
    private router = Router();
    constructor(private readonly memberService : MemberService){
        this.router.post("/signup", this.signup.bind(this))
    }

    private async signup(req: Request, res: Response){
        const body = req.body as SignUpRequest
        res.json(await this.memberService.signup(body));
    }


}