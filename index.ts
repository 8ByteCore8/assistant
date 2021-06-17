import { createConnection } from "typeorm";
import express, { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import config from "./config";
import { User } from "./models/account/User";
import apiRouter from "./routers/api.router";



/**
 * Локальные переменные ответа.
 */
type Locals = {
    user: User;
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
    let connection = await createConnection(config.db);

    const app = express();


    app.use("/api", apiRouter);


    app.listen(config.port, () => console.log("Server started."));

    await connection.close();
}


main();