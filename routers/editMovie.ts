import express, { Request, Response } from "express";
import { getMovieById, updateMovie, getStudios } from "../database";
import { Movie, Studio } from "../interfaces";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/:id", secureMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const movie: Movie | null = await getMovieById(req.params.id);
    const studios: Studio[] = await getStudios("desc");
    
    if (!movie) {
        res.status(404).send("Movie not found");
        return;
    }

    res.render("editMovie", {
        movie: movie,
        studios: studios
    });
});

router.post("/:id", secureMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedMovie = req.body;

    updatedMovie.inTheather = updatedMovie.inTheather === "true";
    updatedMovie.releaseYear = parseInt(updatedMovie.releaseYear);

    await updateMovie(id, updatedMovie);
    res.redirect("/");
});

export default router;