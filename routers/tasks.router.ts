import { NextFunction, Router } from "express";
import Joi from "joi";
import { Permissions, Request, Response } from "../types";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions } from "../middlewares/has-permitions.middleware";
import { Project } from "../models/project/Project";
import { Task } from "../models/project/Task";
import { Attempt } from "../models/project/Attempt";

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
                    await Task.toFlat(_tasks, [
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

                await Task.save(Task.create({
                    ...request.body,
                }));

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:task_id",
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
                const { task_id } = request.params;

                if (request.body["project"])
                    request.body["project"] = await Project.findOneOrFail(request.body["project"]);

                let _task = await Task.findOneOrFail(Number(task_id));

                _task = Task.merge(_task, {
                    ...request.body,
                });

                await Task.save(_task);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .delete("/:id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                let _task = await Task.findOneOrFail(Number(id));

                let _attempts = await Attempt.find({
                    where: {
                        task: _task,
                    }
                });

                await Promise.all([
                    Task.softRemove(_task),
                    Attempt.softRemove(_attempts),
                ]);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );