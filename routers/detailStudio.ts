import express, { Request, Response } from "express";
import { getStudioById } from "../database";
import { Studio } from "../interfaces";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
    const studio: Studio | null = await getStudioById(req.params.id);

    if (!studio) {
        res.status(404).send("Studio not found");
        return;
    }

    res.render("detailStudio", {
        studio: studio
    });
});

export default router;