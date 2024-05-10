import express from "express";
import { createGamesRoute } from "./games/router.js";
import { createUserRoute } from "./user/router.js";

export function createApp(dependences) {
    const app = express();

    app.use(express.json());

    app.use(
        "/games",
        (req, res, next) => {
            res.locals.userId = 1;
            next();
        },
        createGamesRoute(dependences)
    );

    app.use(
        "/user",
        (req, res, next) => {
            res.locals.userId = 1;
            next();
        },
        createUserRoute(dependences)
    );

    return app;
}
