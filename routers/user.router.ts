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
                throw new PermissionsDeniedError();
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/register",
        loginRequired(),
        bodyValidation(Joi.object([
            {
                login: Joi.string().trim().max(50).required(),

                name: Joi.string().trim().max(50).required(),
                lastname: Joi.string().trim().max(50).required(),
                surname: Joi.string().trim().max(50).required(),
                email: Joi.string().trim().email(),

                role: Joi.string().trim().allow("Students").only().required(),
                group: Joi.number().integer().positive().required(),
            }, {
                login: Joi.string().trim().max(50).required(),

                name: Joi.string().trim().max(50).required(),
                lastname: Joi.string().trim().max(50).required(),
                surname: Joi.string().trim().max(50).required(),
                email: Joi.string().trim().email(),

                role: Joi.string().trim().allow("Teachers", "Admins").only().required(),
            }
        ]).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { role, group } = request.body;

                // Проверка прав для создания учёной записи данного типа.
                switch (role) {
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


                // Создание нового пользователя.
                let user = User.create({
                    ...request.body,
                    role: <any>await Role.findOneOrFail({
                        where: {
                            "name": role,
                        },
                        cache: true,
                    })
                } as Object);

                let _password = createPassword();
                // Установка пароля.
                user = await User.setPassword(user, _password);

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
                await User.update(
                    User.getId(response.locals["user"]),
                    request.body
                );

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:id",
        loginRequired(),
        hasPermissions([
            Permissions.teacher,
            Permissions.admin,
        ]),
        bodyValidation(Joi.object({
            "name": Joi.string().trim().max(50),
            "lastname": Joi.string().trim().max(50),
            "surname": Joi.string().trim().max(50),

            "active": Joi.boolean(),

            "group": Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                // Обновление данных пользователя.
                await User.update(
                    {
                        id: Number(id),
                    },
                    request.body
                );

                // Отправка ответа
                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );