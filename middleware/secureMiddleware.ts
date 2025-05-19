import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt;

    if(!token){
         return res.redirect("/login");
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            res.redirect("/login");
        } else {
            res.locals.user = user;
            next();
        }
    });
}