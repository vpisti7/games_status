import z from "zod";

export const addGameZodSchema = z
    .object({
        game_name: z.string().min(1),
        completed_percent: z.number().min(0).max(100),
        wantContinue: z.boolean(),
    })
    .strict();

export const updateGameZodSchema = z
    .object({
        completed_percent: z.number().min(0).max(100).optional(),
        wantContinue: z.boolean().optional(),
    })
    .strict();
