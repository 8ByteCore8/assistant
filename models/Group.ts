import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MyBaseEntity } from ".";
import { User } from "./User";

/**
 * Группы студентов.
 */
@Entity()
export class Group extends MyBaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;


    //#region Данные для авторизации
    @Column({
        length: 50,
        unique: true
    })
    public name: string;

    @OneToMany(type=>User,student=>student.group)
    students:Promise<User[]>

}