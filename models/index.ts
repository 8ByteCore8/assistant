import { DeepPartial, FindConditions, getRepository, ObjectType, SaveOptions } from "typeorm";
import { getClassName } from "../utils";
import { Group } from "./Group";
import { Permission } from "./Permission";
import { User } from "./User";

export abstract class MyBaseEntity {

    /**
     * Предвартиельная инициализаия необходимых записей в таблице.
     */
    static async startUp(): Promise<void> {

    }

    /**
     * Возвращает имя красса модели на основе типа или екземпляра.
     * @param model Екземпляр или тип модели.
     * @returns Имя класса модели.
     */
    static getModelName<T>(model: ObjectType<T> = this): string {
        return getClassName(model).toLowerCase();
    }

    /**
     * Предоставляет название права доступа на создание записи.
     * @param model Екземпляр или тип модели.
     * @returns Право доступа на создание записи.
     */
    public static getCreatePermission<T>(model: ObjectType<T> = this): string {
        return `can_create_${MyBaseEntity.getModelName(model)}`;
    }

    /**
     * Предоставляет название права доступа на редактирование записи.
     * @param model Екземпляр или тип модели.
     * @returns Право доступа на редактирование записи.
     */
    public static getEditPermission<T>(model: ObjectType<T> = this): string {
        return `can_edit_${MyBaseEntity.getModelName(model)}`;
    }

    /**
     * Предоставляет название права доступа на чтение записи.
     * @param model Екземпляр или тип модели.
     * @returns Право доступа на чтение записи.
     */
    public static getReadPermission<T>(model: ObjectType<T> = this): string {
        return `can_read_${MyBaseEntity.getModelName(model)}`;
    }

    /**
     * Предоставляет название права доступа на удаление записи.
     * @param model Екземпляр или тип модели.
     * @returns Право доступа на удаление записи.
     */
    public static getDeletePermission<T>(model: ObjectType<T> = this): string {
        return `can_delete_${MyBaseEntity.getModelName(model)}`;
    }
}


export async function findOrCreate<T>(model: ObjectType<T>, selector: FindConditions<T>, values: DeepPartial<T>, options?: SaveOptions): Promise<T> {
    const repository = getRepository(model);

    let instance = await repository.findOne({
        where: selector
    });

    if (!instance)
        instance = await repository.save(
            repository.create(values),
            options
        );

    return instance;
}

/**
 * Список всех моделей в порядке инициализации.
 */
export const models: MyBaseEntity[] = [
    Permission,
    Group,
    User,
];