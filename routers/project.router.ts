import { NextFunction, Router } from "express";
import Joi from "joi";
import { DeepPartial, getRepository, In } from "typeorm";
import { Request, Response } from "..";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions } from "../middlewares/has-permitions.middleware";
import { Model } from "../models";
import { Group } from "../models/Group";
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
                    await Model.toFlat(projects, [
                        "id",
                        "name",
                        "description",
                    ], {
                        "tasks": async instance => await Model.toFlat(await instance.tasks, [
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
                const repository = getRepository(Project);
                const { id } = request.params;
                let project: Project = await repository.findOne({
                    where: {
                        "id": id
                    }
                });

                return response.status(200).json(
                    await Model.toFlat(project, [
                        "id",
                        "name",
                        "description",
                    ], {
                        "tasks": async instance => await Model.toFlat(await instance.tasks, [
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
            name: Joi.string().trim().not("").max(100).alphanum().required(),
            description: Joi.string().trim().not("").max(2000).alphanum().required(),
            tasks: Joi.array().items(
                Joi.object({
                    name: Joi.string().trim().not("").max(100).alphanum().required(),
                    description: Joi.string().trim().not("").max(2000).alphanum().required(),
                    validator: Joi.string().trim().not("").max(50).alphanum().default(null),
                }).required()
            ).min(1).required(),
            groups: Joi.array().items(
                Joi.number().integer().positive().required()
            ).default([]),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const repository = getRepository(Project);
                const groupRepository = getRepository(Group);
                const taskRepository = getRepository(Task);

                const { name, description, tasks, groups } = request.body;

                let project = await repository.save(repository.create({
                    "name": name,
                    "description": description,
                    "groups": (await groupRepository.find({
                        where: {
                            "id": In(groups)
                        }
                    })) as any,
                    "tasks": (await taskRepository.save(taskRepository.create(tasks.map((task: DeepPartial<Task>) => {
                        return {
                            "name": task.name,
                            "description": task.description,
                            "validator": task.validator,
                        };
                    })))) as any
                }));


                return response.status(200).json(
                    await Model.toFlat(project, [
                        "id",
                        "name",
                        "description",
                    ], {
                        "tasks": async instance => await Model.toFlat(await instance.tasks, [
                            "id",
                            "name",
                            "description",
                            "validator",
                        ])
                    })
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    // .put("/",
    //     loginRequired(),
    //     hasPermissions("can_edit_project"),
    //     bodyValidation(Joi.object({
    //         id: Joi.number().integer().positive().required(),
    //         name: Joi.string().trim().not("").max(100).alphanum().required(),
    //         description: Joi.string().trim().not("").max(2000).alphanum().required(),
    //         tasks: Joi.array().items(
    //             Joi.object({
    //                 id: Joi.number().integer().positive().default(null),
    //                 name: Joi.string().trim().not("").max(100).alphanum().required(),
    //                 description: Joi.string().trim().not("").max(2000).alphanum().required(),
    //                 validator: Joi.string().trim().not("").max(50).alphanum().default(null),
    //             }).required()
    //         ).min(1).required(),
    //         groups: Joi.array().items(
    //             Joi.number().integer().positive().required()
    //         ).default([]),
    //     }).required()),
    //     async function (request: Request, response: Response, next: NextFunction) {
    //         try {
    //             const repository = getRepository(Project);
    //             const groupRepository = getRepository(Group);
    //             const taskRepository = getRepository(Task);

    //             const { id, name, description, tasks, groups } = request.body;


    //             let project = repository.create({
    //                 "id": id,
    //                 "name": name,
    //                 "description": description,
    //                 "groups": (await groupRepository.find({
    //                     where: {
    //                         "id": In(groups)
    //                     }
    //                 })) as any,
    //                 "tasks": (await taskRepository.save(taskRepository.create(tasks.map((task: DeepPartial<Task>) => {
    //                     return {
    //                         "name": task.name,
    //                         "description": task.description,
    //                         "validator": task.validator,
    //                     };
    //                 })))) as any
    //             });

    //             project = repository.recover();


    //             // let project = await repository.save();


    //             return response.status(200).json(
    //                 await Model.toFlat(project, [
    //                     "id",
    //                     "name",
    //                     "description",
    //                 ], {
    //                     "tasks": async instance => await Model.toFlat(await instance.tasks, [
    //                         "id",
    //                         "name",
    //                         "description",
    //                         "validator",
    //                     ])
    //                 })
    //             );
    //         } catch (error) {
    //             return next(error);
    //         }
    //     }
    // );