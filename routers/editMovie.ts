import express, { Request, Response } from "express";
import { getMovieById, updateMovie, getStudios } from "../database";
// import { ObjectId } from "mongodb";
import { Movie, Studio } from "../interfaces";

const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
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

router.post("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedMovie = req.body;

    updatedMovie.inTheather = updatedMovie.inTheather === "true";
    updatedMovie.releaseYear = parseInt(updatedMovie.releaseYear);

    await updateMovie(id, updatedMovie);
    res.redirect("/");
});

export default router;