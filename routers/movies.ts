import express, { Request, Response } from "express";
import { Movie, Studio } from "../interfaces";

export default function movieRouter(movies: Movie[], studios: Studio[]) {
    const router = express.Router();

    router.get("/", (req: Request, res: Response) => {
        let filteredMovies: Movie[] = movies;

        const genre = typeof req.query.genre === "string" ? req.query.genre : "";
        const sortDirection = req.query.sort === "desc" ? "desc" : "asc";

        if (genre) {
            filteredMovies = filteredMovies.filter(movie =>
                movie.genre.toLowerCase().includes(genre.toLowerCase())
            );
        }

        filteredMovies.sort((a, b) => {
            if (sortDirection === "asc") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });

        res.render("movies", {
            movies: filteredMovies,
            genre: genre,
            sortDirection: sortDirection,
            studios: studios
        });
    });

    return router;
}