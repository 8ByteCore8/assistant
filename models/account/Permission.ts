import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";

/**
 * Роли пользователей.
 */
 @Entity({
    name: "permissions",
})
export class Permission extends Model {

    @PrimaryGeneratedColumn({
        name: "id",
    })
    id: number;

    @Column({
        name: "name",
        length: 50,
        unique: true,
    })
    public name: string;
}