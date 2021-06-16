import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractUser } from ".";
import { Group } from "../Group";

/**
 * Учётные записи пользователей.
 */
@Entity()
export class User extends AbstractUser {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 50,
    })
    public name: string;

    @Column({
        length: 50,
    })
    public lastname: string;

    @Column({
        length: 50,
    })
    public surname: string;

    @Column({
        length: 255,
        nullable: true,
    })
    public email: string;

    @ManyToOne(() => Group, group => group.users)
    public group: Promise<Group>;
}