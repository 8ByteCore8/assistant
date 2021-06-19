
import { sign, verify } from "jsonwebtoken";
import { Request, Response } from "..";
import configs from "../config";
import { User } from "../models/account/User";
import { NextHandleFunction } from 'connect';
import { getRepository } from "typeorm";
import { NextFunction } from "express";
import { PermissionsDeniedError } from "../errors";

/**
 * AUTH HEADER FORMAT
 * Authorization: Bearer <token>
 */

/**
 * Закодированая в JWT информация.
 */
export type UserAuthData = {
    id: number;
};

/**
 * Авторизирует пользователя по токену.
 */
export function auth(): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            // Изьятие токена
            let [, token] = request.header("authorization").split(" ", 2);

            // Разштфровка
            const { id } = verify(token, configs.secret) as UserAuthData;

            // Поиск авторизованого пользователя
            response.locals["user"] = await User.findOneOrFail({
                where: {
                    "id": id,
                    "active": true
                },
                cache: true
            });

            return next();
        }
        catch (error) {
            // Если что-то не так, занчит пользователь не авторизован
            response.locals["user"] = null;
            return next();
        }
    };
}

/**
 * Проверяет авторизацию пользоватля.
 */
export function loginRequired(): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            if (!response.locals["user"])
                throw new PermissionsDeniedError();
            return next();
        }
        catch (error) {
            return next(error);
        }
    };
}


export async function getToken(user: User) {
    return sign({ id: user.id } as UserAuthData, configs.secret, { expiresIn: "1h" });
}