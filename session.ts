import session from "express-session";
import { User } from "./types";
import mongoDbSession from "connect-mongodb-session";

const MongoDBStore = mongoDbSession(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URI ?? "mongodb://localhost:27017",
    databaseName: "project",
    collection: "sessions"
});

declare module 'express-session' {
    export interface SessionData {
        user?: User;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret",
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
});