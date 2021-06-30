import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { Group } from "../account/Group";
import { User } from "../account/User";
import { Task } from "./Task";
import Variant from "./Variant";

/**
 * Проекты. По факту категория 
 */
@Entity({
    name: "projects",
})
export class Project extends Model {
    @PrimaryGeneratedColumn({
        name: "id"
    })
    id: number;

    @Column({
        name: "name",
        length: 100,
    })
    name: string;

    @Column({
        name: "description",
        length: 2000,
    })
    description: string;

    @ManyToMany(() => Group, group => group.projects)
    @JoinTable()
    groups: Promise<Group[]>;

    @OneToMany(() => Task, task => task.project, {
        cascade: true
    })
    tasks: Promise<Task[]>;

    @ManyToOne(() => User)
    author: Promise<User>;

    @OneToMany(() => Variant, variant => variant.project)
    variants: Promise<Variant[]>;

    @Column({
        length: 255,
    })
    variant_generator: string;

    @Column({
        length: 20000,
    })
    variant_sources: string;
}