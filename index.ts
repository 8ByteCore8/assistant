import { createConnection } from "typeorm";
import express, { json, Request as ExpressRequest, Response as ExpressResponse, urlencoded } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import config from "./config";
import { User } from "./models/User";
import auth from "./middlewares/auth.middleware";



/**
 * Локальные переменные ответа.
 */
type Locals = {
    user: User | false;
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

    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use(auth());

    // app.use("/api",)


    app.listen(config.port, () => console.log("Server started."));
}


main();