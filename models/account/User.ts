import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractUser } from ".";
import { Group } from "./Group";

/**
 * Учётные записи пользователей.
 */
@Entity({
    name: "users",
    orderBy: {
        lastname: "ASC",
        name: "ASC",
        surname: "ASC",
    },
})
export class User extends AbstractUser {

    @PrimaryGeneratedColumn({
        name: "id",
    })
    public id: number;

    @Column({
        name: "name",
        length: 50,
        nullable: true,
    })
    public name: string;

    @Column({
        name: "lastname",
        length: 50,
        nullable: true,
    })
    public lastname: string;

    @Column({
        name: "surname",
        length: 50,
        nullable: true,
    })
    public surname: string;

    @Column({
        name: "email",
        length: 255,
        nullable: true,
    })
    public email: string;

    @ManyToOne(() => Group, group => group.users)
    public group: Promise<Group>;
}