import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "titkos_kulcs";

export function createUsersRoute() {
    const gamesRouter = express.Router();

    gamesRouter.post("/register", async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Username and password are required");
        }

        try {
            const hashedPassword = await bcrypt.hashSync(password, 10);
            res.status(201).send("User created successfully");
        } catch (err) {
            res.status(500).send("Server error");
        }
    });

    gamesRouter.post("/login", async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("All fields are required");
        }

        try {
            const user = {
                username,
                passwordHash: bcrypt.hashSync(password, 10),
            };

            const match = await bcrypt.compare(password, user.passwordHash);
            if (match) {
                const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
                    expiresIn: "1h",
                });
                res.json({ token });
            } else {
                res.status(401).send("Invalid credentials");
            }
        } catch (err) {
            res.status(500).send("Server error");
        }
    });

    return gamesRouter;
}
