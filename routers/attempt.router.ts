import { NextFunction, Router } from "express";
import Joi from "joi";
import { Permissions, Request, Response } from "..";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions } from "../middlewares/has-permitions.middleware";
import { Attempt, AttemptStates } from "../models/project/Attempt";
import { Task } from "../models/project/Task";

export default Router()
    .get("/:task_id",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { task_id } = request.params;

                let _attempt = await Attempt.find({
                    where: {
                        user: response.locals["user"],
                        task: Number(task_id)
                    }
                });

                return response.status(200).json(
                    await Attempt.toFlat(_attempt, [
                        "id",
                        "data",
                        "is_correct",
                        "state",
                        "created_at",
                    ])
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.teacher]),
        bodyValidation(Joi.object({
            user: Joi.number().integer().positive().required(),
            task: Joi.number().integer().positive().required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { user, task } = request.params;

                let _attempt = await Attempt.find({
                    where: {
                        user: user,
                        task: task
                    }
                });

                return response.status(200).json(
                    await Attempt.toFlat(_attempt, [
                        "id",
                        "data",
                        "is_correct",
                        "state",
                        "created_at",
                    ])
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/",
        loginRequired(),
        bodyValidation(Joi.object({
            task: Joi.number().integer().positive(),
            data: Joi.string().trim().max(2000).required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { task } = request.body;
                let _task = await Task.findOneOrFail(task);

                await Attempt.insert({
                    ...request.body,
                    task: <any>_task,
                    user: <any>response.locals["user"],
                    validator: _task.validator,
                    state: _task.validator ? AttemptStates.PendingAutoChecking : AttemptStates.PendingChecking,
                    created_at: Date.now(),
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
            is_correct: Joi.boolean().required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { id } = request.params;

                await Attempt.update({
                    id: Number(id),
                }, {
                    ...request.body,
                    state: AttemptStates.Checked,
                });

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );