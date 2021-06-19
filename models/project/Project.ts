import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { Group } from "../account/Group";
import { Task } from "./Task";

/**
 * Проекты. По факту категория 
 */
@Entity()
export class Project extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        length: 2000,
    })
    description: string;

    @ManyToMany(() => Group, group => group.projects)
    @JoinTable()
    groups: Promise<Group[]>;

    @OneToMany(() => Task, task => task.project)
    tasks: Promise<Task[]>;
}