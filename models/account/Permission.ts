import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";

/**
 * Роли пользователей.
 */
@Entity()
export class Permission extends Model {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    public name: string;
}