import { NextFunction, Router } from "express";
import Joi from "joi";
import { Permissions, Request, Response } from "../types";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions, validatePermissions } from "../middlewares/has-permitions.middleware";
import { Group } from "../models/account/Group";
import { User } from "../models/account/User";
import { Project } from "../models/project/Project";
import { Task } from "../models/project/Task";
import { Attempt } from "../models/project/Attempt";
import { In } from "typeorm";

export default Router()
    .get("/",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let _projects: Project[];

                if (await validatePermissions(Permissions.admin, response.locals["user"], response.locals["permissions"]))
                    // Админ видит все проекты
                    _projects = await Project.find();
                else if (await validatePermissions(Permissions.admin, response.locals["user"], response.locals["permissions"]))
                    // Преподаватель видит только те проекты которые создал.
                    _projects = await Project.find({
                        where: {
                            author: response.locals["user"],
                        }
                    });
                else {
                    // Студент полько проекты его группы.
                    let _group = await response.locals["user"].group;
                    _projects = await _group.projects;
                }

                return response.status(200).json(
                    await Project.toFlat(_projects, [
                        "id",
                        "name",
                        "description",
                    ], {
                        "author": async instance => await User.toFlat(await instance.author, [
                            "id",
                            "lastname",
                            "name",
                            "surname"
                        ]),
                        "groups": async instance => await Group.toFlat(await instance.groups, [
                            "id",
                            "name",
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
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(100).required(),
            description: Joi.string().trim().max(2000).required(),
            tasks: Joi.array().items(
                Joi.number().integer().positive()
            ).default([]),
            groups: Joi.array().items(
                Joi.number().integer().positive()
            ).default([]),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                request.body["groups"] = await Group.findByIds(request.body["groups"]);
                request.body["tasks"] = await Task.findByIds(request.body["tasks"]);
                request.body["author"] = response.locals["user"];

                await Project.insert({
                    ...request.body,
                });


                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:project_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            name: Joi.string().trim().max(100),
            description: Joi.string().trim().max(2000),
            tasks: Joi.array().items(
                Joi.number().integer().positive()
            ).default([]),
            groups: Joi.array().items(
                Joi.number().integer().positive()
            ).default([]),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { project_id } = request.params;

                request.body["groups"] = await Group.findByIds(request.body["groups"]);
                request.body["tasks"] = await Task.findByIds(request.body["tasks"]);

                await Project.update(
                    {
                        id: Number(project_id),
                    },
                    {
                        ...request.body,
                    });

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

                let _project = await Project.findOneOrFail(Number(id));
                let _tasks = await Task.find({
                    where: {
                        project: _project,
                    }
                });
                let _attempts = await Attempt.find({
                    where: {
                        task: In(_tasks),
                    }
                });

                await Promise.all([
                    Project.softRemove(_project),
                    Task.softRemove(_tasks),
                    Attempt.softRemove(_attempts),
                ]);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );