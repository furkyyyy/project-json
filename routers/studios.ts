import express, { Request, Response } from "express";
import { Studio } from "../interfaces";

export default function studioRouter(studios: Studio[]) {
    const router = express.Router();

    router.get("/", (req: Request, res: Response) => {
        let sortedStudios = studios;

        const sortDirection = req.query.sort === "desc" ? "desc" : "asc";

        sortedStudios = studios.sort((a, b) => {
            if (sortDirection === "asc") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        res.render("studios", {
            studios: sortedStudios,
            sortDirection: sortDirection
        });
    });

    return router;
}
