import express, { NextFunction } from 'express';
import Joi from 'joi';
import { Permissions, Request, Response } from '../types';
import { bodyValidation } from '../middlewares/body-validation.middleware';
import { getToken, loginRequired } from '../middlewares/auth.middleware';
import { User } from '../models/account/User';
import { PermissionsDeniedError } from '../errors';
import { hasPermissions, validatePermissions } from '../middlewares/has-permitions.middleware';
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
                    }
                });

                // Проверка результата поиска и проверка пароля.
                if (user && await User.checkPassword(user, password)) {
                    // Авторизация.
                    return response.status(200).json({
                        "token": await getToken(user),
                    });
                }
                throw new PermissionsDeniedError();
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/register",
        loginRequired(),
        bodyValidation(Joi.object({
            login: Joi.string().trim().max(50).required(),

            name: Joi.string().trim().max(50).required(),
            lastname: Joi.string().trim().max(50).required(),
            surname: Joi.string().trim().max(50).required(),
            email: Joi.string().trim().email().default(null),

            role: Joi.string().trim().allow("Students").only().required(),
            group: Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                console.log(request.body);


                // Проверка прав для создания учёной записи данного типа.
                switch (request.body["role"]) {
                    case "Students":
                        if (!await validatePermissions([Permissions.teacher, Permissions.admin], response.locals["user"], response.locals["permissions"]))
                            throw new PermissionsDeniedError();
                        else
                            // Запихнул суда для опимизации :)
                            request.body["group"] = await Group.findOneOrFail({
                                where: {
                                    "id": request.body["group"],
                                },
                                cache: true
                            });
                        break;
                    case "Teachers":
                        if (!await validatePermissions(Permissions.admin, response.locals["user"], response.locals["permissions"]))
                            throw new PermissionsDeniedError();
                        break;
                    default:
                        if (!await validatePermissions("", response.locals["user"], response.locals["permissions"]))
                            throw new PermissionsDeniedError();
                        break;
                }

                request.body["role"] = await Role.findOneOrFail({
                    where: {
                        name: request.body["role"]
                    },
                    cache: true
                });

                // Создание нового пользователя.
                let _user = User.create({
                    ...request.body
                } as Object);

                // Генерация и установка пароля.
                let _password = createPassword();
                _user = await User.setPassword(_user, _password);

                // Сохранение.
                await User.save(_user);

                // Отправка ответа
                return response.status(200).json({
                    "login": request.body["login"],
                    "password": _password,
                });
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
            password: Joi.string().trim().min(8),
            email: Joi.string().trim().email(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let _user = response.locals["user"];

                _user = User.merge(_user, {
                    ...request.body,
                });

                await User.save(_user);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:user_id",
        loginRequired(),
        hasPermissions([
            Permissions.teacher,
            Permissions.admin,
        ]),
        bodyValidation(Joi.object({
            "name": Joi.string().trim().max(50),
            "lastname": Joi.string().trim().max(50),
            "surname": Joi.string().trim().max(50),

            "group": Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { user_id } = request.params;

                // Обновление данных пользователя.
                let _user = await User.findOneOrFail(Number(user_id));

                _user = User.merge(_user, {
                    ...request.body,
                });

                await User.save(_user);

                // Отправка ответа
                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/:group_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { group_id } = request.params;

                let _users = await User.find({
                    where: {
                        "group": Number(group_id),
                    },
                });

                return response.status(200).json(
                    await User.toFlat(_users, [
                        "id",
                        "name",
                        "lastname",
                        "surname",
                    ])
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .delete("/:user_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { user_id } = request.params;

                let _user = await User.findOneOrFail(Number(user_id));

                switch ((await _user.role).name) {
                    case "Students":
                        if (!await validatePermissions([Permissions.teacher, Permissions.admin], response.locals["user"], response.locals["permissions"]))
                            throw new PermissionsDeniedError();
                        break;
                    case "Teachers":
                        if (!await validatePermissions(Permissions.admin, response.locals["user"], response.locals["permissions"]))
                            throw new PermissionsDeniedError();
                        break;
                    default:
                        if (!await validatePermissions("", response.locals["user"], response.locals["permissions"]))
                            throw new PermissionsDeniedError();
                        break;
                }

                await Promise.all([
                    User.softRemove(_user),
                ]);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );