import { Request, Response, NextFunction } from "express";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (user?.role !== "ADMIN") {
    return res.redirect("/");
  }

  next();
}