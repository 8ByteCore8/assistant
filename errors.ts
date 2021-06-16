export class HttpError extends Error {
    constructor(message: string);
    constructor(message: string, code: number);
    constructor(message: string, code?: number) {
        super(message);
        this.code = code || 500;
    }

    public code: number;

    public static convert(error: Error): HttpError {
        return new HttpError(error.message);
    }
}

export class PermissionsDeniedError extends HttpError {
    constructor() {
        super("Permissions denied", 403);
    }
}