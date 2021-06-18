import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from ".";
import { User } from "./account/User";
import { Project } from "./project/Project";

/**
 * Группы студентов.
 */
@Entity()
export class Group extends Model {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    public name: string;

    @OneToMany(() => User, profile => profile.group)
    users: User[];

    @ManyToMany(() => Project, project => project.groups)
    projects: Project[];
}