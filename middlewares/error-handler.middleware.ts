
import { Request, Response } from "..";
import { NextFunction } from "express";
import { HttpError } from "../errors";


export default function errorHandler() {
    return async function (error: HttpError, request: Request, response: Response, next: NextFunction) {
        if (!(error instanceof HttpError))
            error = HttpError.convert(error);

        response.status(error.code).json({
            "error": error.message
        });

        next(error);
    };
};