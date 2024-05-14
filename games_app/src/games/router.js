import express from "express";
import { addGameZodSchema, updateGameZodSchema } from "./schema.js";
import { parser } from "./parser-middleware.js";

export function createGamesRoute({
    loadGames,
    saveGame,
    getGameByTitle,
    updateGame,
    deleteGame,
}) {
    const gamesRouter = express.Router();

    gamesRouter.get("", (req, res, next) => {
        loadGames({ userId: res.locals.userId })
            .then((games) => res.json(games))
            .catch((err) => next(err));
    });

    gamesRouter.get("/:game", (req, res, next) => {
        getGameByTitle({
            game_name: req.params.game,
            userId: res.locals.userId,
        })
            .then((game) => res.json(game))
            .catch((err) => next(err));
    });

    gamesRouter.delete("/:game", (req, res, next) => {
        deleteGame({
            game_name: req.params.game,
            userId: res.locals.userId,
        })
            .then(() => res.sendStatus(204))
            .catch((err) => next(err));
    });

    gamesRouter.post("", parser(addGameZodSchema), (req, res, next) => {
        saveGame({ ...res.locals.parsed, userId: res.locals.userId })
            .then(() => res.sendStatus(201))
            .catch((err) => next(err));
    });

    gamesRouter.put("/:game", parser(updateGameZodSchema), (req, res, next) => {
        updateGame({
            ...res.locals.parsed,
            game_name: req.params.game,
            userId: res.locals.userId,
        })
            .then(() => res.sendStatus(204))
            .catch((err) => next(err));
    });

    return gamesRouter;
}
