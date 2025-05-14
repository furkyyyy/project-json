import express, { Request, Response } from "express";
import { Movie, Studio } from "../interfaces";

export default function detailMovieRouter(movies: Movie[], studios: Studio[]) {
    const router = express.Router();

    router.get("/:id", (req: Request, res: Response) => {
        const movie = movies.find(m => m.id === req.params.id);

        if (!movie) {
            res.status(404).send("Movie not found");
            return;
        }

        const studio = studios.find(s => s.id === movie.studio.id);

        res.render("detailMovie", {
            movie: movie,
            studio: studio
        });
    });

    return router;
}