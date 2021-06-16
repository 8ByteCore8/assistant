import { DeepPartial, FindConditions, getRepository, ObjectType, SaveOptions } from "typeorm";
import { getClassName } from "../utils";

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
