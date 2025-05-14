import express, { Express, Request, Response } from "express";
import path from "path";
import { Movie, Studio } from "./interfaces";
import movies from "./movies.json";
import studios from "./studios.json";
import movieRouter from "./routers/movies";
import detailMovieRouter from "./routers/detailMovie";
import studioRouter from "./routers/studios";
import detailStudioRouter from "./routers/detailStudio";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", 3000);

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});
app.use("/movies", movieRouter(movies, studios));
app.use("/detail-movie", detailMovieRouter(movies, studios));
app.use("/studios", studioRouter(studios));
app.use("/detail-studio", detailStudioRouter(studios));

app.get("/", (req: Request, res: Response) => {
    let sortedMovies: Movie[] = movies;

    const title = typeof req.query.title === "string" ? req.query.title : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "title";
    const order = req.query.order === "desc" ? "desc" : "asc";

    if (title) {
        sortedMovies = sortedMovies.filter(movie =>
            movie.title.toLowerCase().includes(title.toLowerCase())
        );
    }

    sortedMovies = [...sortedMovies].sort((a, b) => {
        switch (sort) {
            case "releaseYear":
                return order === "desc"
                    ? a.releaseYear - b.releaseYear
                    : b.releaseYear - a.releaseYear;
            case "genre":
                return order === "asc"
                    ? a.genre.localeCompare(b.genre)
                    : b.genre.localeCompare(a.genre);
            case "studio":
                return order === "asc"
                    ? a.studio.name.localeCompare(b.studio.name)
                    : b.studio.name.localeCompare(a.studio.name);
            case "inTheather":
                return order === "desc"
                    ? Number(a.inTheather) - Number(b.inTheather)
                    : Number(b.inTheather) - Number(a.inTheather);
            case "title":
            default:
                return order === "asc"
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
        }
    });

    res.render("index", {
        movies: sortedMovies,
        sort: sort,
        order: order,
        studios: studios,
        title: title
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
});