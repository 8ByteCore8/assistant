import express, { NextFunction } from 'express';
import Joi from 'joi';
import { Permissions, Request, Response } from '../types';
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

                await Group.save(Group.create({
                    ...request.body
                }));

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:group_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(50),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { group_id } = request.params;

                let _group = await Group.findOneOrFail(Number(group_id));

                _group = Group.merge(_group, {
                    ...request.body,
                });

                await Group.save(_group);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .delete("/:group_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { group_id } = request.params;

                let _group = await Group.findOneOrFail(Number(group_id));
                let _users = await User.find({
                    where: {
                        group: _group
                    }
                });

                await Promise.all([
                    Group.softRemove(_group),
                    User.softRemove(_users),
                ]);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );