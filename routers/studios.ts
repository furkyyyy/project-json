import express, { Request, Response } from "express";
import { getStudios } from "../database";
import { Studio } from "../interfaces";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const sortDirection = req.query.sort === "desc" ? "desc" : "asc";
    const studios: Studio[] = await getStudios(sortDirection);

    res.render("studios", {
        studios: studios,
        sortDirection: sortDirection
    });
});

export default router;