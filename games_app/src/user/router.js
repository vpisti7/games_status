import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "./userSchema.js";
import { validator } from "../validator-middleware.js";

const SECRET_KEY = "titkos_kulcs";

export function createUsersRoute({ saveUser, getUserByEmail }) {
    const gamesRouter = express.Router();

    gamesRouter.post("/register", validator(userSchema), async (req, res) => {
        const { email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await saveUser({ email, password: hashedPassword });
            res.status(201).send("User created successfully");
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    gamesRouter.post("/login", validator(userSchema), async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await getUserByEmail({ email });
            if (!result) {
                return res.status(401).send("Invalid credentials");
            }
            const userPassword = result.password;
            const match = await bcrypt.compare(password, userPassword);
            if (match) {
                const token = jwt.sign({ userId: result.userId }, SECRET_KEY, {
                    expiresIn: "1h",
                });
                res.json({ token });
            } else {
                res.status(401).send("Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    });

    return gamesRouter;
}
