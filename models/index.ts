import { DeepPartial, ObjectType } from "typeorm";
import { getClassName } from "../utils";

export type Relations<T> = {
    [P in keyof T]?: (instance: T) => Promise<any | any[]>
};

export abstract class Model {
    /**
     * Возвращает имя красса модели на основе типа или екземпляра.
     * @param model Екземпляр или тип модели.
     * @returns Имя класса модели.
     */
    static getModelName<T>(model: ObjectType<T> = this): string {
        return getClassName(model).toLowerCase();
    }


    static toFlat<T>(instances: T[], fields: (keyof T)[], relations?: Relations<T>): Promise<object[]>;
    static toFlat<T>(instance: T, fields: (keyof T)[], relations?: Relations<T>): Promise<object>;
    static async toFlat<T>(instance: T | T[], fields: (keyof T)[], relations?: Relations<T>) {
        if (instance instanceof Array)
            return instance.map(item => Model.toFlat(item, fields, relations));

        let flat_instance = {};
        for (const key of (fields as string[])) {
            flat_instance[key] = instance[key];
        }

        if (relations)
            for (const key in relations) {
                flat_instance[key as string] = await relations[key](instance);
            }

        return flat_instance;
    }
}