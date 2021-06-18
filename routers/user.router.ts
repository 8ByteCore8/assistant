import express, { NextFunction } from 'express';
import Joi from 'joi';
import { getRepository } from 'typeorm';
import { Request, Response } from '..';
import { bodyValidation } from '../middlewares/body-validation.middleware';
import { getToken, loginRequired } from '../middlewares/auth.middleware';
import { User } from '../models/account/User';
import { HttpError, PermissionsDeniedError } from '../errors';
import { hasPermissions, validatePermissions } from '../middlewares/has-permitions.middleware';
import { Role } from '../models/account/Role';
import { Group } from '../models/Group';
import { randomBytes } from 'crypto';
import { Model } from '../models';

export default express.Router()
    .post("/login",
        bodyValidation(Joi.object({
            login: Joi.string().trim().not("").max(50).alphanum().required(),
            password: Joi.string().trim().required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const repository = getRepository(User);
                const { login, password } = request.body;

                // Поиск пользователя.
                let user = await repository.findOne({
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
        hasPermissions("can_register"),
        bodyValidation(Joi.object({
            login: Joi.string().trim().not("").max(50).alphanum().required(),
            password: Joi.string().trim().min(8).default(null),

            name: Joi.string().trim().not("").max(50).alphanum().required(),
            lastname: Joi.string().trim().not("").max(50).alphanum().required(),
            surname: Joi.string().trim().not("").max(50).alphanum().required(),
            email: Joi.string().trim().email().default(null),

            role: Joi.string().trim().allow("Students", "Teachers", "Admins").default("Students"),
            group: Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const repository = getRepository(User);
                const roleRepository = getRepository(Role);
                const { login, password, name, lastname, surname, email, role, group } = request.body;

                // Проверка прав для создания учёной записи данного типа.
                if (!await validatePermissions(`register_${(role as string).toLowerCase()}`, response.locals["user"], response.locals["permissions"]))
                    throw new PermissionsDeniedError();

                // Поиск пользователя с таким-же логином.
                let user = await repository.findOne({
                    where: {
                        "login": login,
                    }
                });

                if (!user) {
                    // Создание нового пользователя.
                    user = repository.create({
                        "login": login,
                        "name": name,
                        "lastname": lastname,
                        "surname": surname,
                        "email": email,
                    });

                    const _password = password || randomBytes(32).toString("utf-8");

                    // Установка пароля.
                    user = await User.setPassword(user, _password);

                    // Указание типа учётной записи.
                    user.role = await roleRepository.findOneOrFail({
                        where: {
                            "name": role,
                        },
                        cache: true,
                    });

                    // Заполнение доп. поля для студентов.
                    if (role === "Students") {
                        const groupRepository = getRepository(Group);
                        user.group = await groupRepository.findOneOrFail({
                            where: {
                                "id": group,
                            },
                            cache: true
                        });
                    }

                    // Сохранение.
                    user = await repository.save(user);

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
                        "name",
                        "lastname",
                        "surname",
                        "email",
                    ], {
                        "role": async instance => {
                            let role = instance.role;

                            if (role)
                                return role.name;
                            else
                                return null;
                        },
                        "group": async instance => {
                            let group = instance.group;
                            if (group)
                                return await Model.toFlat(group, [
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
                const repository = getRepository(User);
                const { password, email } = request.body;
                let user = response.locals["user"];

                if (password)
                    user = await User.setPassword(user, password);

                if (email)
                    user.email = email;

                if (password || email)
                    await repository.save(user);

                return response.status(200).send();

            } catch (error) {
                return next(error);
            }
        }
    );