import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "./userSchema.js";
import { validator } from "../validator-middleware.js";

export function createUsersRoute({
    saveUser,
    getUserByEmail,
    deleteUser,
    deleteUserGames,
}) {
    const gamesRouter = express.Router();

    gamesRouter.post("/register", validator(userSchema), async (req, res) => {
        const { email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await saveUser({ email, password: hashedPassword });
        } catch (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
        const result = await getUserByEmail({ email });
        const token = jwt.sign(
            { userId: result.id },
            process.env.TOKEN_SECRET,
            {
                expiresIn: "600s",
            }
        );
        res.json({ token }).status(201);
    });

    gamesRouter.post("/login", validator(userSchema), async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await getUserByEmail({ email });

            const userPassword = result.password;
            const match = await bcrypt.compare(password, userPassword);
            if (match) {
                const token = jwt.sign(
                    { userId: result.id },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: "600s",
                    }
                );
                res.json({ token });
            } else {
                res.status(401).send("Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            res.status(401).send("Invalid credentials");
        }
    });

    gamesRouter.delete("/delete", validator(userSchema), async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await getUserByEmail({ email });
            const match = await bcrypt.compare(password, result.password);
            if (match) {
                await deleteUser({ email: result.email });
                await deleteUserGames({ userId: result.id });
                res.status(204).send();
            } else {
                res.status(401).send("Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            res.status(401).send("Invalid credentials");
        }
    });

    return gamesRouter;
}
