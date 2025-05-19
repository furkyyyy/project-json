import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { Collection} from "mongodb";
import {client} from "../database"
import { User } from "../types";
import { redirectIfAuthenticated } from "../middleware/redirectIfAuthenticated";

const router = Router();
const saltRounds: number = 10;

router.get("/register", redirectIfAuthenticated, (req: Request, res: Response) => {
  res.render("register", { error: "" });
});

router.post("/register", async (req: Request, res: Response) => {
  const usersCollection: Collection<User> = client.db("project").collection<User>("users");
  const users = usersCollection;
  
  const existingEmail = await users.findOne({ email: req.body.email });
  if (existingEmail) {
    return res.render("register", { error: "Email is already in use" });
  }  
  const existingUsername = await users.findOne({ username: req.body.username });
  if (existingUsername) {
    return res.render("register", { error: "Username is already in use" });
  }

  const hashed = await bcrypt.hash(req.body.password, saltRounds);

  await users.insertOne({
    email: req.body.email,
    username: req.body.username,
    password: hashed,
    role: "USER",
  });

  res.redirect("/login");
});

export default router;