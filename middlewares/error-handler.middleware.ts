
import { Request, Response } from "..";
import { NextFunction } from "express";
import { HttpError } from "../errors";


export function errorHandler() {
    return async function (error: HttpError, request: Request, response: Response, next: NextFunction) {
        try {
            if (!(error instanceof HttpError))
                error = HttpError.convert(error);

            response.status(error.code).json({
                "error": error.message
            });

            return next(error);
        } catch (error) {
            return next(error);
        }
    };
};