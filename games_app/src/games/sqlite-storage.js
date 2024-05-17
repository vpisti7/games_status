import sqlite3 from "sqlite3";
import { AlreadyExist, NoData, NotFoundError } from "../error-handling.js";

export async function connectToSqlite(filepath, callback) {
    const db = new sqlite3.Database(filepath, (err) => {
        callback(err, {
            loadGames: ({ userId, wantContinue, finished }) => {
                return new Promise((resolve, reject) => {
                    let sql = "select * from games where user_id = ?";
                    const params = [userId];

                    if (wantContinue !== undefined) {
                        sql += " AND wantContinue = ?";
                        params.push(wantContinue);
                    }

                    if (finished !== undefined) {
                        sql += " AND finished = ?";
                        params.push(finished);
                    }

                    db.all(sql, params, (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            },
            async saveGame({
                game_name,
                completed_percent,
                wantContinue,
                userId,
            }) {
                return new Promise((resolve, reject) => {
                    db.get(
                        "SELECT * FROM games WHERE game_name = ? AND user_id = ?",
                        [game_name, userId],
                        (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (row) {
                                reject(
                                    new AlreadyExist(
                                        "Game already exists for this user."
                                    )
                                );
                                return;
                            }

                            let finished = completed_percent === 100;
                            db.run(
                                "insert into games(game_name, completed_percent, finished, wantContinue, user_id) values (?, ?, ?, ?, ?)",
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
                        }
                    );
                });
            },
            async getGameByTitle({ game_name, userId }) {
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
                                        `Game with name: ${game_name} not found.`
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
                wantContinue,
                userId,
            }) {
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
                                        `Game with name: ${game_name} not found.`
                                    )
                                );
                            }
                        }
                    );
                    if (
                        completed_percent === undefined &&
                        wantContinue === undefined
                    ) {
                        reject(new NoData("No data to update."));
                    }
                    let sql = "UPDATE games SET ";
                    const params = [];

                    if (completed_percent !== undefined) {
                        sql += "completed_percent = ? ";
                        params.push(completed_percent);

                        const finished =
                            completed_percent === 100 ? true : false;
                        sql += ",finished = ? ";
                        params.push(finished);
                    }

                    if (
                        completed_percent !== undefined &&
                        wantContinue !== undefined
                    ) {
                        sql += " , ";
                    }

                    if (wantContinue !== undefined) {
                        sql += "wantContinue = ? ";
                        params.push(wantContinue);
                    }

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
            //USER

            async saveUser({ email, password }) {
                return new Promise((resolve, reject) => {
                    db.run(
                        "INSERT INTO users (email, password) VALUES (?, ?)",
                        [email, password],
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
            async getUserByEmail({ email }) {
                return new Promise((resolve, reject) => {
                    db.get(
                        "SELECT * FROM users WHERE email = ?",
                        [email],
                        (err, row) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (!row) {
                                    reject(
                                        new NotFoundError(
                                            `User with email: ${email} not found.`
                                        )
                                    );
                                }
                                resolve(row);
                            }
                        }
                    );
                });
            },
            async deleteUser({ email }) {
                return new Promise((resolve, reject) => {
                    db.run(
                        "DELETE FROM users WHERE email = ?",
                        [email],
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
            async deleteUserGames({ userId }) {
                return new Promise((resolve, reject) => {
                    db.run(
                        "DELETE FROM games WHERE user_id = ?",
                        [userId],
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
