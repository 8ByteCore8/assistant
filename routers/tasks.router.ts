import { NextFunction, Router } from "express";
import Joi from "joi";
import { Permissions, Request, Response } from "../types";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions } from "../middlewares/has-permitions.middleware";
import { Project } from "../models/project/Project";
import { Task } from "../models/project/Task";

export default Router()
    .get("/:project_id",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { project_id } = request.params;

                let _tasks = await Task.find({
                    where: {
                        project: Number(project_id),
                    }
                });

                return response.status(200).json(
                    Task.toFlat(_tasks, [
                        "id",
                        "name",
                        "description",
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
            name: Joi.string().trim().max(100).required(),
            description: Joi.string().trim().max(2000).required(),
            validator: Joi.string().trim().max(50),
            project: Joi.number().integer().positive().required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {

                request.body["project"] = await Project.findOneOrFail(request.body["project"]);

                await Task.insert({
                    ...request.body,
                });

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(100),
            description: Joi.string().trim().max(2000),
            validator: Joi.string().trim().max(50),
            project: Joi.number().integer().positive(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                if (request.body["project"])
                    request.body["project"] = await Project.findOneOrFail(request.body["project"]);

                await Task.update(
                    {
                        id: Number(id),
                    },
                    {
                        ...request.body,
                    });

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );