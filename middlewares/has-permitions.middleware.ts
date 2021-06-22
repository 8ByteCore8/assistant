import { Request, Response } from "..";
import { NextHandleFunction } from 'connect';
import { Permission } from "../models/account/Permission";
import { User } from "../models/account/User";;
import { NextFunction } from "express";
import { PermissionsDeniedError } from "../errors";

/**
 * Функция для проверки прав доступа.
 */
export type PermissionValidatorFunction = {
    (user: User, permissions: string[]): Promise<boolean>;
};

/**
 * Алиас для задания проверяемых прав доступа разными способами.
 */
export type PermissionValidator = Object | Array<PermissionValidator> | string | PermissionValidatorFunction;

/**
 * Валидирует пользователя на достаточное количество привелегий для выпонения действия.
 * @param permission Опции для валидаци:
 *                      string - проверка наличия по имени,
 *                      function - Функция-валидатор,
 *                      [] - Параметры будут проверяться через оператор ИЛИ (OR),
 *                      {} - Параметры будут проверяться через оператор И (AND).
 * @param user Авторизованый пользователь.
 * @param permissions Список прав доступа пользователя.
 * @returns true - Пользователь может выполнить действие, иначе - false.
 */
export async function validatePermissions(permission: PermissionValidator, user: User, permissions: string[]): Promise<boolean> {
    if (user.superuser === true)
        return true;
    else if (typeof permission === "string") {
        return permissions.includes(permission);
    }
    else if (typeof permission === "function")
        return await permission(user, permissions);
    else if (typeof permission === "object") {
        if (permission instanceof Array) {
            for (const part of permission)
                if (await validatePermissions(part, user, permissions) === true)
                    return true;
            return false;
        }
        else {
            for (const key in permission)
                if (await validatePermissions(permission[key], user, permissions) === false)
                    return false;
            return true;
        }
    }

}

/**
 * Извлекает права доступа из базы и записывает в locals.
 */
export function permissions(): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            let user = response.locals["user"];

            if (user) {
                // Права доступа пользователя
                let all_permissions = await user.permissions;

                let role = await user.role;
                if (role) {
                    response.locals["role"] = role;
                    all_permissions = all_permissions.concat(await role.permissions);
                }
                else
                    response.locals["role"] = null;

                // Названия прав доступа
                response.locals["permissions"] = [];
                for (const permission of all_permissions)
                    response.locals["permissions"].push(permission.name);
            }
            else
                response.locals["permissions"] = null;

            return next();
        } catch (error) {
            return next(error);
        }
    };
};

/**
 * Проверяет права доступа пользователя.
 * @param permissions Список необходимых разрешений.
 */
export function hasPermissions(permission: PermissionValidator): NextHandleFunction {
    return async function (request: Request, response: Response, next: NextFunction) {
        try {
            let user = response.locals["user"];
            let permissions = response.locals["permissions"];

            if (user) {
                // Суперпользователю можно всё. Зачем на него тратить время?
                if (user.superuser)
                    return next();

                // Проверка наличия всех необходимых прав
                if (await validatePermissions(permission, user, permissions))
                    return next();

            }
            throw new PermissionsDeniedError();
        }
        catch (error) {
            return next(error);
        }
    };
}
