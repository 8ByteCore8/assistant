import express, { NextFunction } from 'express';
import Joi from 'joi';
import { Permissions, Request, Response } from '..';
import { bodyValidation } from '../middlewares/body-validation.middleware';
import { loginRequired } from '../middlewares/auth.middleware';
import { User } from '../models/account/User';
import { hasPermissions } from '../middlewares/has-permitions.middleware';
import { Group } from '../models/account/Group';

export default express.Router()
    .get("/",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let groups = await Group.find();

                return response.status(200).json(
                    await Group.toFlat(groups, [
                        "id",
                        "name"
                    ])
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(50).required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {

                await Group.insert(Group.create(
                    request.body
                ));

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/:id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                let groups = await Group.findOneOrFail({
                    where: {
                        "id": Number(id),
                    },
                });

                return response.status(200).json(
                    await Group.toFlat(groups, [
                        "id",
                        "name"
                    ], {
                        users: async instance => await User.toFlat(await instance.users, [
                            "id",
                            "name",
                            "lastname",
                            "surname",
                        ])
                    })
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(50),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                await Group.update(
                    Number(id),
                    request.body
                );

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );