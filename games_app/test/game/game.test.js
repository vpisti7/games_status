import { describe, it, before, after } from "node:test";
import assert, { AssertionError } from "node:assert";
import { connectToSqlite } from "./../../src/games/sqlite-storage.js";
import { AlreadyExist } from "../../src/error-handling.js";

describe("saveGame", () => {
    it("add a game to games when the database is empty", async () => {
        const { deleteUserGames, saveGame, loadGames } = await new Promise(
            (resolve, reject) => {
                connectToSqlite("test.db", (err, functions) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(functions);
                });
            }
        );

        await deleteUserGames({ userId: 1 });

        await saveGame({
            game_name: "D",
            completed_percent: 0,
            wantContinue: true,
            userId: 1,
        });

        const games = await loadGames({ userId: 1 });

        const { game_name, id, wantContinue, finished, completed_percent } =
            games[0];

        assert.strictEqual(game_name, "D");
        assert.strictEqual(completed_percent, 0);
        assert.strictEqual(wantContinue, 1);
        assert.strictEqual(id, 1);
        assert.strictEqual(finished, 0);

        try {
            const game = await saveGame({
                game_name: "D",
                completed_percent: 0,
                wantContinue: true,
                userId: 1,
            });
        } catch (err) {
            assert(err instanceof AlreadyExist);
        }
    });

    it("add a game when a game already exist the same name", async () => {
        const { deleteUserGames, saveGame, loadGames } = await new Promise(
            (resolve, reject) => {
                connectToSqlite("test.db", (err, functions) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(functions);
                });
            }
        );

        await deleteUserGames({ userId: 1 });

        await saveGame({
            game_name: "D",
            completed_percent: 0,
            wantContinue: true,
            userId: 1,
        });

        const games = await loadGames({ userId: 1 });

        const { game_name, id, wantContinue, finished, completed_percent } =
            games[0];

        assert.strictEqual(game_name, "D");
        assert.strictEqual(completed_percent, 0);
        assert.strictEqual(wantContinue, 1);
        assert.strictEqual(id, 1);
        assert.strictEqual(finished, 0);

        try {
            const game = await saveGame({
                game_name: "D",
                completed_percent: 0,
                wantContinue: true,
                userId: 1,
            });
        } catch (err) {
            assert(err instanceof AlreadyExist);
        }
    });
});
