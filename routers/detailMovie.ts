import express, { Request, Response } from "express";
import { getMovieById, getStudioById } from "../database";
import { Movie, Studio } from "../interfaces";
import { secureMiddleware } from "../middleware/secureMiddleware";

const router = express.Router();

router.get("/:id", secureMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id;
    const movie: Movie | null = await getMovieById(id);

    if (!movie) {
        res.status(404).send("Movie not found");
        return;
    }

    const studio: Studio | null = await getStudioById(movie.studio.id);

    res.render("detailMovie", {
        movie: movie,
        studio: studio
    });
});

export default router;