
import { Request, Response } from "../types";
import { NextHandleFunction } from 'connect';
import { NextFunction } from "express";


/**
 * Оборачивает в try-catch
 */
export function trycatch(): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
};