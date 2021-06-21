import express, { NextFunction } from 'express';
import Joi from 'joi';
import { Request, Response } from '..';
import { bodyValidation } from '../middlewares/body-validation.middleware';
import { loginRequired } from '../middlewares/auth.middleware';
import { User } from '../models/account/User';
import { HttpError } from '../errors';
import { hasPermissions } from '../middlewares/has-permitions.middleware';
import { Group } from '../models/account/Group';

export default express.Router()
    .get("/",
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let groups = await Group.find({
                    order: {
                        "name": "ASC"
                    }
                });

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
        hasPermissions("can_create_group"),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(50).required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { name } = request.body;

                let group = await Group.findOne({
                    where: {
                        "name": name
                    }
                });

                if (!group) {
                    group = Group.create({
                        "name": name,
                    });

                    group = await Group.save(group);

                    return response.status(200).send()
                }
                throw new HttpError("Group with this login already exists.", 400);
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/:id",
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                let groups = await Group.findOneOrFail({
                    where: {
                        "id": id,
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
        hasPermissions("can_create_group"),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(50).default(null),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;
                const { name } = request.body;

                let group = await Group.findOneOrFail({
                    where: {
                        "id": id
                    }
                });

                if (name)
                    group.name = name;

                group = await Group.save(group);

                return response.status(200).send()
            } catch (error) {
                return next(error);
            }
        }
    );