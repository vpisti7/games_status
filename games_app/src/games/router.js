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
            .then((games) => {
                res.json(games);
            })
            .catch(next);
    });

    gamesRouter.get("/:game", async (req, res, next) => {
        try {
            const game = await getGameByTitle({
                game_name: req.params.game,
                userId: res.locals.userId,
            });
            res.json(game);
        } catch (err) {
            next(err);
        }
    });

    gamesRouter.delete("/:game", (req, res, next) => {
        deleteGame({ game_name: req.params.game, userId: res.locals.userId })
            .then(() => {
                res.sendStatus(204);
            })
            .catch(next);
    });

    gamesRouter.post("", parser(addGameZodSchema), async (req, res, next) => {
        try {
            await saveGame({ ...res.locals.parsed, userId: res.locals.userId });
            res.sendStatus(201);
        } catch (err) {
            next(err);
        }
    });

    gamesRouter.put(
        "/:game",
        parser(updateGameZodSchema),
        async (req, res, next) => {
            try {
                await updateGame({
                    ...res.locals.parsed,
                    game_name: req.params.game,
                    userId: res.locals.userId,
                });
                res.sendStatus(204);
            } catch (err) {
                next(err);
            }
        }
    );

    return gamesRouter;
}
