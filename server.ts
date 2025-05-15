import express, { Express, Request, Response } from "express";
import path from "path";
import { Movie, Studio } from "./interfaces";
import movieRouter from "./routers/movies";
import detailMovieRouter from "./routers/detailMovie";
import studioRouter from "./routers/studios";
import detailStudioRouter from "./routers/detailStudio";
import { connect, getMovies, getStudios } from "./database";
import editMovieRouter from "./routers/editMovie";

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

app.use("/movies", movieRouter);
app.use("/detail-movie", detailMovieRouter);
app.use("/studios", studioRouter);
app.use("/detail-studio", detailStudioRouter);
app.use("/edit-movie", editMovieRouter);

app.get("/", async (req: Request, res: Response) => {
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
        title
    });
});

app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});