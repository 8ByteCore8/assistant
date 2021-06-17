
import { sign, verify } from "jsonwebtoken";
import { Request, Response } from "..";
import configs from "../config";
import { User } from "../models/account/User";
import { NextHandleFunction } from 'connect';
import { getRepository } from "typeorm";
import { NextFunction } from "express";

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
export default function auth(): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            const repository = getRepository(User);

            // Изьятие токена
            let [, token] = request.header("authorization").split(" ", 2);

            // Разштфровка
            const { id } = verify(token, configs.secret) as UserAuthData;

            // Поиск авторизованого пользователя
            response.locals["user"] = await repository.findOneOrFail({
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


export async function getToken(user: User) {
    return sign({ id: user.id } as UserAuthData, configs.secret, { expiresIn: "1h" });
}