import express from "express";
import { createGamesRoute } from "./games/router.js";
import { createUsersRoute } from "./user/router.js";
import { errorHandler } from "./error-handling.js";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ message: "Authorization token is missing" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        res.locals.userId = decoded.userId;

        next();
    });
};

export function createApp(dependences) {
    const app = express();

    app.use(express.json());

    app.use(
        "/games",
        verifyToken,
        (req, res, next) => {
            next();
        },
        createGamesRoute(dependences)
    );

    app.use(
        "/user",
        (req, res, next) => {
            next();
        },
        createUsersRoute(dependences)
    );

    app.use((err, req, res, next) => {
        errorHandler(err, req, res, next);
    });

    return app;
}
