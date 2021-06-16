import { ObjectType } from "typeorm";
import { getClassName } from "../utils";

export abstract class Model {

    /**
     * Возвращает имя красса модели на основе типа или екземпляра.
     * @param model Екземпляр или тип модели.
     * @returns Имя класса модели.
     */
    static getModelName<T>(model: ObjectType<T> = this): string {
        return getClassName(model).toLowerCase();
    }
}