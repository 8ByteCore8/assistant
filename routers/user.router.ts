import express, { NextFunction } from 'express';
import Joi from 'joi';
import { Request, Response } from '..';
import { bodyValidation } from '../middlewares/body-validation.middleware';
import { getToken, loginRequired } from '../middlewares/auth.middleware';
import { User } from '../models/account/User';
import { HttpError, PermissionsDeniedError } from '../errors';
import { validatePermissions } from '../middlewares/has-permitions.middleware';
import { Role } from '../models/account/Role';
import { Group } from '../models/account/Group';

function createPassword(): string {
    return Math.random().toString(36).slice(2) +
        Math.random().toString(36).toUpperCase().slice(2);
}

export default express.Router()
    .post("/login",
        bodyValidation(Joi.object({
            login: Joi.string().trim().max(50).required(),
            password: Joi.string().trim().required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { login, password } = request.body;

                // Поиск пользователя.
                let user = await User.findOne({
                    where: {
                        "login": login,
                        "active": true,
                    }
                });

                // Проверка результата поиска и проверка пароля.
                if (user && await User.checkPassword(user, password)) {
                    // Авторизация.
                    return response.status(200).json({
                        "token": await getToken(user),
                    });
                }
                throw new HttpError("Invalid login data.", 403);
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/register",
        loginRequired(),
        bodyValidation(Joi.object({
            login: Joi.string().trim().max(50).required(),
            password: Joi.string().trim().min(8).default(null),

            name: Joi.string().trim().max(50).required(),
            lastname: Joi.string().trim().max(50).required(),
            surname: Joi.string().trim().max(50).required(),
            email: Joi.string().trim().email().default(null),

            role: Joi.string().trim().allow("Students", "Teachers", "Admins").only().default("Students"),
            group: Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { login, password, name, lastname, surname, email, role, group } = request.body;

                // Проверка прав для создания учёной записи данного типа.
                if (!await validatePermissions(`can_create_${(role as string).toLowerCase()}`, response.locals["user"], response.locals["permissions"]))
                    throw new PermissionsDeniedError();

                // Поиск пользователя с таким-же логином.
                let user = await User.findOne({
                    where: {
                        "login": login,
                    }
                });

                if (!user) {
                    // Создание нового пользователя.
                    user = User.create({
                        "login": login,
                        "name": name,
                        "lastname": lastname,
                        "surname": surname,
                        "email": email,
                    });

                    const _password = password || createPassword();

                    // Установка пароля.
                    user = await User.setPassword(user, _password);

                    // Указание типа учётной записи.
                    user.role = <any>await Role.findOneOrFail({
                        where: {
                            "name": role,
                        },
                        cache: true,
                    });

                    // Заполнение доп. поля для студентов.
                    if (role === "Students") {
                        user.group = <any>await Group.findOneOrFail({
                            where: {
                                "id": group,
                            },
                            cache: true
                        });
                    }

                    // Сохранение.
                    user = await User.save(user);

                    // Отправка ответа
                    return response.status(200).json({
                        "login": login,
                        "password": _password,
                    });
                }
                else
                    throw new HttpError("User with this login already exists.", 400);
            } catch (error) {
                return next(error);
            }
        }
    )
    // TODO: Сделать изменение пользователя.
    .put("/",
        loginRequired(),
        bodyValidation(Joi.object({
            "id": Joi.number().integer().positive().required(),
            "name": Joi.string().trim().max(50),
            "lastname": Joi.string().trim().max(50),
            "surname": Joi.string().trim().max(50),

            "active": Joi.boolean(),

            "group": Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id, name, lastname, surname, role, group } = request.body;

                // Проверка прав для создания учёной записи данного типа.
                if (!await validatePermissions(`can_create_${(role as string).toLowerCase()}`, response.locals["user"], response.locals["permissions"]))
                    throw new PermissionsDeniedError();

                // Поиск пользователя с таким-же логином.
                let user = await User.preload(
                    request.body
                );

                if (user) {
                    // Сохранение.
                    user = await User.save(user);

                    // Отправка ответа
                    return response.status(200).send();
                }
                else
                    throw new HttpError("User with this login already exists.", 400);
            } catch (error) {
                return next(error);
            }
        }
    )
    .head("/",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                return response.status(200).json(
                    await User.toFlat(response.locals["user"], [
                        "id",
                        "name",
                        "lastname",
                        "surname",
                        "email",
                    ], {
                        "role": async instance => {
                            let role = await instance.role;

                            if (role)
                                return role.name;
                            else
                                return null;
                        },
                        "group": async instance => {
                            let group = await instance.group;
                            if (group)
                                return await Group.toFlat(group, [
                                    "id",
                                    "name",
                                ]);
                            else
                                return null;
                        },
                    })
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/",
        loginRequired(),
        bodyValidation(Joi.object({
            password: Joi.string().trim().min(8).default(null),
            email: Joi.string().trim().email().default(null),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { password, email } = request.body;
                let user = response.locals["user"];

                if (password)
                    user = await User.setPassword(user, password);

                if (email)
                    user.email = email;

                if (password || email)
                    user = await User.save(user);

                return response.status(200).send();

            } catch (error) {
                return next(error);
            }
        }
    );