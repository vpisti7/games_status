import z from "zod";

export function validator(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body); // Ez automatikusan hibát dob, ha a validáció sikertelen
            next();
        } catch (err) {
            next(err);
        }
    };
}
