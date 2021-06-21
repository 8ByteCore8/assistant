import { NextFunction, Router } from "express";
import Joi from "joi";
import { DeepPartial, In } from "typeorm";
import { Request, Response } from "..";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions } from "../middlewares/has-permitions.middleware";
import { Model } from "../models";
import { Group } from "../models/account/Group";
import { Project } from "../models/project/Project";
import { Task } from "../models/project/Task";

export default Router()
    .get("/",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let user = response.locals["user"];
                let projects: Project[] = await (await user.group).projects;

                return response.status(200).json(
                    await Project.toFlat(projects, [
                        "id",
                        "name",
                        "description",
                    ], {
                        "tasks": async instance => await Task.toFlat(await instance.tasks, [
                            "id",
                            "name",
                            "description",
                        ])
                    })
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/:id",
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;
                let project: Project = await Project.findOne({
                    where: {
                        "id": id
                    }
                });

                return response.status(200).json(
                    await Project.toFlat(project, [
                        "id",
                        "name",
                        "description",
                    ], {
                        "tasks": async instance => await Task.toFlat(await instance.tasks, [
                            "id",
                            "name",
                            "description",
                        ])
                    })
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/",
        loginRequired(),
        hasPermissions("can_create_project"),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(100).required(),
            description: Joi.string().trim().max(2000).required(),
            tasks: Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().max(100).required(),
                    description: Joi.string().trim().max(2000).required(),
                    validator: Joi.string().trim().max(50).default(null),
                }).required()
            ).min(1).required(),
            groups: Joi.array().items(
                Joi.number().integer().positive().required()
            ).default([]),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { name, description, tasks, groups } = request.body;

                let _tasks = await Task.save(Task.create(tasks.map((task: DeepPartial<Task>) => {
                    return {
                        "name": task.name,
                        "description": task.description,
                        "validator": task.validator,
                    };
                })));

                let _groups = await Group.find({
                    where: {
                        "id": In(groups)
                    }
                });

                let project = await Project.save(Project.create({
                    "name": name,
                    "description": description,
                    "groups": <any>_groups,
                    "tasks": <any>_tasks
                }));


                return response.status(200).send()
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/",
        loginRequired(),
        hasPermissions("can_create_project"),
        bodyValidation(Joi.object({
            id: Joi.number().integer().positive().required(),
            name: Joi.string().trim().max(100).required(),
            description: Joi.string().trim().max(2000).required(),
            tasks: Joi.array().items(
                Joi.object({
                    id: Joi.number().integer().positive().default(null),
                    name: Joi.string().trim().max(100).required(),
                    description: Joi.string().trim().max(2000).required(),
                    validator: Joi.string().trim().max(50).default(null),
                }).required()
            ).min(1).required(),
            groups: Joi.array().items(
                Joi.number().integer().positive().required()
            ).default([]),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id, name, description, tasks, groups } = request.body;

                let _groups: Group[] = await Group.find({
                    where: {
                        "id": In(groups)
                    }
                });


                // TODO: Проверить работает ли это вообще.
                let _tasks: Task[] = [];
                for (const task of Task.create(tasks)) {
                    _tasks.push(
                        Task.hasId(task)
                            ? await Task.preload(task)
                            : task
                    );
                }

                let project: Project = await Project.preload({
                    "id": id,
                    "name": name,
                    "description": description,
                    "groups": <any>_groups,
                    "tasks": <any>_tasks
                });

                project = await project.save();


                return response.status(200).send()
            } catch (error) {
                return next(error);
            }
        }
    );