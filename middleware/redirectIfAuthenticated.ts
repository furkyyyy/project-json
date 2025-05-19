import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export function redirectIfAuthenticated(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.jwt;

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any) => {
    if (err) {
        res.clearCookie("jwt");
        return next();
    } else {
        return res.redirect("/");
    }
  });
}