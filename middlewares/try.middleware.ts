
import { Request, Response } from "..";
import { NextHandleFunction } from 'connect';
import { NextFunction } from "express";


/**
 * Оборачивает в try-catch
 */
export default function trycatch(): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            next();
        }
        catch (error) {
            next(error);
        }
    };
};