import express, { Request, Response } from "express";
import { Studio } from "../interfaces";

export default function detailStudioRouter(studios: Studio[]) {
    const router = express.Router();

    router.get("/:id", (req: Request, res: Response) => {
        const studio = studios.find(s => s.id === req.params.id);

        if (!studio) {
            res.status(404).send("Studio not found");
            return;
        }

        res.render("detailStudio", {
            studio: studio
        });
    });

    return router;
}
