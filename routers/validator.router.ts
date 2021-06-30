import { NextFunction, Router } from "express";
import Joi, { string } from "joi";
import { loginRequired } from "../middlewares/auth.middleware";
import { bodyValidation } from "../middlewares/body-validation.middleware";
import { hasPermissions } from "../middlewares/has-permitions.middleware";
import Validator from "../models/project/Validator";
import { Permissions, Request, Response } from "../types";
import { runScript } from "../validator";

export default Router()
    .get("/",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let _validators = await Validator.find();

                return response.status(200).json(
                    await Validator.toFlat(_validators, [
                        "id",
                        "name"
                    ])
                );
            } catch (error) {
                return next(error);
            }
        }
    )
    .get("/:validator_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { validator_id } = request.params;
                let _validator = await Validator.findOneOrFail(Number(validator_id));

                return response.status(200).json(
                    await Validator.toFlat(_validator, [
                        "id",
                        "name",
                        "script",
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
            "name": string().trim().max(100).required(),
            "script": string().trim().max(20000).required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                await Validator.save(Validator.create({
                    ...request.body,
                }));

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .post("/debug",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            "data": string().trim().max(2000).required(),
            "base": string().trim().max(2000),
            "variant": string().trim().max(2000),
            "script": string().trim().max(20000).required(),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const result = await runScript(request.body["script"], {
                    "data": request.body["data"],
                    "base": request.body["base"],
                    "variant": request.body["variant"],
                });

                return response.status(200).json({
                    ...result,
                    error: result.error.message
                });
            } catch (error) {
                return next(error);
            }
        }
    )
    .put("/:validator_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        bodyValidation(Joi.object({
            "name": string().trim().max(100),
            "script": string().trim().max(20000),
        }).required()),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { validator_id } = request.params;

                let _validator = await Validator.findOneOrFail(Number(validator_id));

                _validator = Validator.merge(_validator, {
                    ...request.body,
                });

                await Validator.save(_validator);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    )
    .delete("/:validator_id",
        loginRequired(),
        hasPermissions([Permissions.teacher, Permissions.admin]),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { validator_id } = request.params;

                let _validartor = await Validator.findOneOrFail(Number(validator_id));

                await Promise.all([
                    Validator.softRemove(_validartor),
                ]);

                return response.status(200).send();
            } catch (error) {
                return next(error);
            }
        }
    );