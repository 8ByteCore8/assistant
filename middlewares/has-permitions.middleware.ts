import { Request, Response } from "..";
import { NextHandleFunction } from 'connect';
import { Permission } from "../models/Permission";
import { getManager } from "typeorm";
import { User } from "../models/User";

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
async function validatePermissions(permission: PermissionValidator, user: User, permissions: string[]): Promise<boolean> {
    if (typeof permission === "string")
        return permission in permissions;
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
 * Проверяет права доступа пользователя.
 * @param permissions Список необходимых разрешений.
 */
export default function hasPermissions(permission: PermissionValidator): NextHandleFunction {
    return async function (request: Request, response: Response, next: Function) {
        try {


            let user = response.locals["user"];

            if (user) {
                // Суперпользователю можно всё. Зачем на него тратить время?
                if (user.superuser)
                    return next();

                // Права доступа пользователя
                let user_permissions: Permission[] = await getManager().query([
                    "SELECT permission",
                    "FROM permission",
                    "LEFT OUTER JOIN user",
                    `ON user.id = ${user.id}`,
                    "LEFT OUTER JOIN user_permission_permission",
                    "ON user_permission_permission.permissionId = permission.id",
                    "AND user_permission_permission.userId = user.id",
                    "LEFT OUTER JOIN group_permission_permission",
                    "ON group_permission_permission.permissionId = permission.id",
                    "AND group_permission_permission.groupId = user.groupId",
                    "WHERE permission.id = user_permission_permission.permissionId",
                    "OR permission.id = group_permission_permission.permissionId",
                ].join(" "));

                // Названия прав доступа
                let permissions_names: string[] = [];
                for (const permission of user_permissions)
                    permissions_names.push(permission.name);

                // Проверка наличия всех необходимых прав
                if (await validatePermissions(permission, user, permissions_names))

                    return next();
            }
            throw new Error("Permissions denied");
        }
        catch (error) {
            next(error);
        }
    };
}