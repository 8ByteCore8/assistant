import { Request, Response } from "..";
import { AsyncValidationOptions, ObjectSchema } from "joi";
import { NextHandleFunction } from 'connect';
import { NextFunction } from "express";

/**
 * Проверяет request.body на соответствие схеме.
 * @param schema Схема тела запроса
 * @param options Опции валидации
 */
export default function bodyValidation(schema: ObjectSchema, options?: AsyncValidationOptions): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            // Валидация и очитска request.body
            request.body = await schema.validateAsync(request.body, {
                stripUnknown: true,
                convert: true,
                ...options,
            });

            next();
        }
        catch (error) {
            next(error);
        }
    };
}