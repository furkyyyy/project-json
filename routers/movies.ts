import express, { Request, Response } from "express";
import { getMovies, getStudios } from "../database";
import { Movie, Studio } from "../interfaces";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    const genre = typeof req.query.genre === "string" ? req.query.genre : "";
    const sortDirection = req.query.sort === "desc" ? "desc" : "asc";

    const movies: Movie[] = await getMovies("title", sortDirection, "");

    let filteredMovies: Movie[] = movies;
    if (genre) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
    }

    const studios: Studio[] = await getStudios("desc");

    res.render("movies", {
        movies: filteredMovies,
        genre: genre,
        sortDirection: sortDirection,
        studios: studios
    });
});

export default router;