import express from "express";
import { secureMiddleware } from "../middleware/secureMiddleware";
import { getMovies, getStudios } from "../database";
import { Movie, Studio } from "../interfaces";

export function dashboardRouter() {
    const router = express.Router();

    router.get("/", secureMiddleware, async(req, res) => {
        const title = typeof req.query.title === "string" ? req.query.title : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "title";
        const order = req.query.order === "desc" ? "desc" : "asc";

        const movies: Movie[] = await getMovies(sort, order, title);
        const studios: Studio[] = await getStudios("desc");

        res.render("index", {
            movies,
            sort,
            order,
            studios,
            title,
            user: res.locals.user
        });
    });

    return router;
}