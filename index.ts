import { createConnection, getManager } from "typeorm";
import express, { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import config from "./config";
import { User } from "./models/account/User";
import apiRouter from "./routers/api.router";
import { Role } from "./models/account/Role";


export enum Permissions{
    student="student",
    teacher="teacher",
    admin="admin",
}

/**
 * Локальные переменные ответа.
 */
type Locals = {
    user: User;
    role: Role;
    permissions: string[];
};

/**
 * Запрос пользователя.
 */
export type Request = ExpressRequest<ParamsDictionary, any, any, ParsedQs, Locals>;

/**
 * Ответ сервера.
 */
export type Response = ExpressResponse<any, Locals>;

async function main() {
    await createConnection(config.db);

    const app = express();

    app.use("/api", apiRouter);


    app.listen(config.port, () => console.log("Server started."));
}

main();