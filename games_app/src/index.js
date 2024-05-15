import { createApp } from "./app.js";
import { connectToSqlite } from "./games/sqlite-storage.js";
import dotenv from "dotenv";

process.on("unhandledRejection", (reason, promise) => {
    console.log("🚨🚨🚨🚨 Graceful shutdown...", reason);
    process.exit(1);
});

connectToSqlite("games.db", (err, client) => {
    if (err) {
        return console.log("Hiba tortent: ", err);
    }
    dotenv.config();
    const app = createApp(client);

    app.listen(8000, () => {
        console.log("Service is listening on http://localhost:8000");
    });
});
