import { ObjectType } from "typeorm";

export function getClassName<T>(instance: ObjectType<T>): string {
    return instance.name;
}