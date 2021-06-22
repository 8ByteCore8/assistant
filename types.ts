import { Role } from "./models/account/Role";
import { User } from "./models/account/User";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

/**
 * Пресеты прав доступа.
 */
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
