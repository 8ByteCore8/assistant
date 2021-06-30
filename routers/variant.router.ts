import { NextFunction, Router } from "express";
import { loginRequired } from "../middlewares/auth.middleware";
import { Project } from "../models/project/Project";
import Variant from "../models/project/Variant";
import { Request, Response } from "../types";


async function getVariant(generator: string, sources: string) {
}

export default Router()
    .get("/",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                let _variants = await Variant.find({
                    where: {
                        user: response.locals["user"]
                    },
                    cache: true,
                    loadRelationIds: true,
                });

                return response.status(200).json(
                    await Variant.toFlat(_variants, [
                        "project",
                        "data",
                    ])
                );
            } catch (error) {
                next(error);
            }
        }
    )
    .post("/:project_id",
        loginRequired(),
        async function (request: Request, response: Response, next: NextFunction) {
            try {
                const { project_id } = request.params;

                const _project = await Project.findOneOrFail(Number(project_id));

                // TODO: Сделать генерацию вариантов.
                request.body["data"] = await getVariant(_project.variant_generator, JSON.parse(_project.variant_sources));

                let _variant = await Variant.save(Variant.create({
                    ...request.body,
                }));

                return response.status(200).json(
                    await Variant.toFlat(_variant, [
                        "project",
                        "data",
                    ])
                );
            } catch (error) {
                next(error);
            }
        }
    );