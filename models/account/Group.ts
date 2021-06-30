import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "./User";
import { Project } from "../project/Project";

/**
 * Группы студентов.
 */
@Entity({
    name: "groups",
})
export class Group extends Model {

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

    @OneToMany(() => User, profile => profile.group)
    users: Promise<User[]>;

    @ManyToMany(() => Project, project => project.groups)
    projects: Promise<Project[]>;
}