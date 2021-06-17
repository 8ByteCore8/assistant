import express, { NextFunction } from 'express';
import Joi from 'joi';
import { getRepository } from 'typeorm';
import { Request, Response } from '..';
import bodyValidation from '../middlewares/body-validation.middleware';
import { getToken } from '../middlewares/auth.middleware';
import { User } from '../models/account/User';
import { HttpError, PermissionsDeniedError } from '../errors';
import hasPermissions, { validatePermissions } from '../middlewares/has-permitions.middleware';
import { Role } from '../models/account/Role';
import { Group } from '../models/Group';

export default express.Router()
    .post("/",
        bodyValidation(Joi.object({
            login: Joi.string().trim().not("").max(50).alphanum().required(),
            password: Joi.string().trim().min(8).required(),
        })),
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
                next(error);
            }
        }
    )
    .post("/register",
        hasPermissions("register"),
        bodyValidation(Joi.object({
            login: Joi.string().trim().not("").max(50).alphanum().required(),
            password: Joi.string().trim().min(8).required(),

            name: Joi.string().trim().not("").max(50).alphanum().required(),
            lastname: Joi.string().trim().not("").max(50).alphanum().required(),
            surname: Joi.string().trim().not("").max(50).alphanum().required(),
            email: Joi.string().trim().email().default(null),

            role: Joi.string().trim().allow("Students", "Teachers", "Admins").default("Students"),
            group: Joi.number().integer().positive().required(),
        })),
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

                    // Установка пароля.
                    user = await User.setPassword(user, password);

                    // Указание типа учётной записи.
                    user.role = roleRepository.findOneOrFail({
                        where: {
                            "name": role,
                        },
                        cache: true
                    });

                    // Заполнение доп. поля для студентов.
                    if (role === "Students") {
                        const groupRepository = getRepository(Group);
                        user.group = groupRepository.findOneOrFail({
                            where: {
                                "id": group,
                            },
                            cache: true
                        });
                    }

                    // Сохранение.
                    user = await repository.save(user);

                    // Отправка ответа
                    return response.status(200);
                }
                else
                    throw new HttpError("User with this login already exists.", 400);
            } catch (error) {
                next(error);
            }
        }
    );
