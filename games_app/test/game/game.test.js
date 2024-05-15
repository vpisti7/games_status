import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import sqlite3 from "sqlite3";
import { connectToSqlite } from "./../../src/games/sqlite-storage.js";

let dbFunctions;

async function setupDatabase() {
    console.log("Setting up in-memory database...");
    return new Promise((resolve, reject) => {
        connectToSqlite(":memory:", (err, functions) => {
            if (err) {
                console.error("Error connecting to SQLite:", err);
                reject(err);
                return;
            }
            dbFunctions = functions;
            console.log("Database connected, setting up tables...");
            db.run(
                `
                CREATE TABLE games (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    game_name TEXT,
                    completed_percent INTEGER,
                    finished BOOLEAN,
                    wantContinue BOOLEAN
                );`,
                (err) => {
                    if (err) {
                        console.error("Error creating tables:", err);
                        reject(err);
                    } else {
                        console.log("Tables set up successfully.");
                        resolve();
                    }
                }
            );
        });
    });
}

async function teardownDatabase() {
    return new Promise((resolve, reject) => {
        if (dbFunctions && dbFunctions.db) {
            dbFunctions.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}

beforeEach(async () => {
    console.log("Before setupDatabase call");
    await setupDatabase();
    console.log("After setupDatabase call");
});

afterEach(async () => {
    console.log("Before teardownDatabase call");
    await teardownDatabase();
    console.log("After teardownDatabase call");
});

describe("Database operations - loadGames", () => {
    it("should load games for a specific user based on filters", async () => {
        console.log("Test begins.");
        await dbFunctions.saveGame({
            game_name: "Test Game",
            completed_percent: 90,
            wantContinue: true,
            userId: 1,
        });

        const games = await dbFunctions.loadGames({
            userId: 1,
            wantContinue: true,
            finished: false,
        });
        console.log("Test ends.");
        assert.strictEqual(games.length, 1);
        assert.strictEqual(games[0].game_name, "Test Game");
    });
});
