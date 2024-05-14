import express from "express";
import { createGamesRoute } from "./games/router.js";
import { createUsersRoute } from "./user/router.js";
import { errorHandler } from "./error-handling.js";

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
        createUsersRoute(dependences)
    );

    app.use((err, req, res, next) => {
        errorHandler(err, req, res, next);
    });

    return app;
}
