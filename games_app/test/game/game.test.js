import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { connectToSqlite } from "./../../src/games/sqlite-storage.js";

describe("SQLite Database Tests", () => {
    let dbFunctions;

    it(async () => {
        await new Promise((resolve, reject) => {
            connectToSqlite("test.db", (err, functions) => {
                if (err) {
                    reject(err);
                }
                dbFunctions = functions;

                dbFunctions.db.run(
                    `
                    CREATE TABLE IF NOT EXISTS games (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        game_name TEXT,
                        completed_percent INTEGER,
                        finished BOOLEAN,
                        wantContinue BOOLEAN
                    );`,
                    (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    }
                );
            });
        });
        await dbFunctions.saveGame({
            game_name: "Sample Game",
            completed_percent: 50,
            wantContinue: true,
            userId: 1,
        });

        const result = await dbFunctions.getGameByTitle({
            game_name: "Sample Game",
            userId: 1,
        });

        assert.strictEqual(result.game_name, "Sample Game", "The game name should match the input");
        assert.strictEqual(result.completed_percent, 50, "The completed percent should match the input");
        assert.strictEqual(result.wantContinue, true, "The wantContinue flag should be true");
    });

    after(async () => {
        console.log(dbFunctions)
        await new Promise((resolve, reject) => {
            // Eldobja a games táblát a tesztek után
            dbFunctions.db.run("DROP TABLE IF EXISTS games", (err) => {
                if (err) {
                    reject(err);
                }
                dbFunctions.db.close((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    });
});