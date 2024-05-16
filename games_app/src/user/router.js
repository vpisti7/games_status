import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "./userSchema.js";
import { validator } from "../validator-middleware.js";

export function createUsersRoute({ saveUser, getUserByEmail }) {
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
            if (!result) {
                return res.status(401).send("Invalid credentials");
            }
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
            res.status(500).send("Server error");
        }
    });

    return gamesRouter;
}
