import express, { Request, Response } from "express";
import { login } from "../database";
import { User } from "../types";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { redirectIfAuthenticated } from "../middleware/redirectIfAuthenticated";
import * as jwt from 'jsonwebtoken';

export function loginRouter(){
    const router = express.Router();

    router.get("/login", redirectIfAuthenticated, (req: Request, res: Response) => {
        res.render("login");
    });

    router.post("/login", async (req: Request, res: Response) => {
        const email: string = req.body.email;
        const password: string = req.body.password;
        try {
            let user : User = await login(email, password);
            delete user.password;

            const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET!, {expiresIn: "7d",});
            res.cookie("jwt", token, { httpOnly: true, sameSite: "lax" });
            res.redirect("/");
        } catch (e: any) {
            res.redirect("/login");
        }
    });
    
    router.post("/logout", secureMiddleware, async(req: Request, res: Response) => {
        res.clearCookie("jwt");
        res.redirect("/login");
    });

    return router;
}