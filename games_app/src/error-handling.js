export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NotAuthorized extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NoData extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class AlreadyExist extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

function mapErrorToStatusCode(err) {
    switch (err.name) {
        case "NoData":
            return 400;
        case "NotFoundError":
            return 404;
        case "NotAuthorized":
            return 401;
        case "AlreadyExist":
            return 409;
        default:
            return 500;
    }
}

export function errorHandler(err, req, res, next) {
    console.log("Hiba tortent: ", err);
    const code = mapErrorToStatusCode(err);
    res.status(code).send(err.message);
}
