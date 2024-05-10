import sqlite3 from "sqlite3";
import { NotFoundError } from "../error-handling.js";

export async function connectToSqlite(filepath, callback) {
    const db = new sqlite3.Database(filepath, (err) => {
        callback(err, {
            loadGames: ({ userId }) => {
                return new Promise((resolve, reject) => {
                    db.all(
                        "select * from games where user_id = ?",
                        userId,
                        (err, rows) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(rows);
                        }
                    );
                });
            },
            saveGame({
                game_name,
                completed_percent,
                finished,
                wantContinue,
                userId,
            }) {
                return new Promise((resolve, reject) => {
                    db.run(
                        "insert into games(game_name,completed_percent,finished,wantContinue,user_id) values (?, ?, ?, ?,?)",
                        [
                            game_name,
                            completed_percent,
                            finished,
                            wantContinue,
                            userId,
                        ],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            },
            getGameByTitle({ game_name, userId }) {
                return new Promise((resolve, reject) => {
                    db.get(
                        "select * from games where game_name = ? and user_id = ?",
                        [game_name, userId],
                        (err, row) => {
                            if (err) {
                                reject(err);
                            }

                            if (!row) {
                                reject(
                                    new NotFoundError(
                                        `Game with title ${game_name} not found.`
                                    )
                                );
                            }

                            resolve(row);
                        }
                    );
                });
            },
            async updateGame({
                game_name,
                completed_percent,
                finished,
                wantContinue,
                userId,
            }) {
                return new Promise((resolve, reject) => {
                    let sql = "UPDATE games SET ";
                    const params = [];

                    if (completed_percent !== undefined) {
                        sql += "completed_percent = ?, ";
                        params.push(completed_percent);
                    }
                    if (finished !== undefined) {
                        sql += "finished = ?, ";
                        params.push(finished);
                    }
                    if (wantContinue !== undefined) {
                        sql += "wantContinue = ?, ";
                        params.push(wantContinue);
                    }

                    sql = sql.slice(0, -2);
                    sql += " WHERE game_name = ? and user_id = ?;";
                    params.push(game_name);
                    params.push(userId);

                    db.run(sql, params, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            },
            async deleteGame({ game_name, userId }) {
                return new Promise((resolve, reject) => {
                    db.run(
                        "DELETE FROM games WHERE game_name = ? AND user_id = ?",
                        [game_name, userId],
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            },
        });
    });
}
