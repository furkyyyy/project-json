import express, { Express } from "express";
import path from "path";
import movieRouter from "./routers/movies";
import detailMovieRouter from "./routers/detailMovie";
import studioRouter from "./routers/studios";
import detailStudioRouter from "./routers/detailStudio";
import { connect } from "./database";
import editMovieRouter from "./routers/editMovie";
import cookieParser from "cookie-parser";
import session from "./session";
import { dashboardRouter } from "./routers/dashboardRouter";
import { loginRouter } from "./routers/login";
import registerRouter from "./routers/register";

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(session);

app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
    res.locals.path = req.path;
    res.locals.user = null;
    next();
});

app.use("/", dashboardRouter());
app.use("/", loginRouter());
app.use("/movies", movieRouter);
app.use("/detail-movie", detailMovieRouter);
app.use("/studios", studioRouter);
app.use("/detail-studio", detailStudioRouter);
app.use("/edit-movie", editMovieRouter);
app.use(registerRouter);

app.listen(app.get("port"), async () => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});