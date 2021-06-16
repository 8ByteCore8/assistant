import { compare, hash } from "bcryptjs";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MyBaseEntity } from ".";
import { Roles } from "../common";
import { Group } from "./Group";

/**
 * Учётные записи пользователей.
 */
@Entity()
export class User extends MyBaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    //#region Данные для авторизации
    @Column({
        length: 50,
        unique: true
    })
    public login: string;

    @Column({
        length: 60,
        select: false
    })
    public password: string;
    //#endregion

    //#region Информация о пользователе
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
        select: false
    })
    public email: string;
    //#endregion

    //#region Информация о студенте
    @ManyToOne(type => Group, group => group.students)
    group: Promise<Group>;
    //#endregion


    @Column({
        default: false,
        select: false
    })
    public active: boolean;

    @Column({
        length: 75,
    })
    public role: Roles;


    //#region Methods

    public static async setPassword(user: User, password: string): Promise<User> {
        user.password = await hash(password, 10);
        return user;
    }

    public static async checkPassword(user: User, password: string): Promise<Boolean> {
        return compare(password, user.password);
    }

    //#endregion
}