import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { Project } from "./Project";

@Entity()
export class Task extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
    })
    name: string;

    @Column({
        length: 2000,
    })
    description:string

    @Column({
        nullable: true,
        length:50,
    })
    validator: string;

    @ManyToOne(() => Project, project => project.tasks)
    project: Promise<Project>;

    // @ManyToMany(() => Task, task => task.dependents)
    // @JoinTable()
    // depends: Promise<Task[]>;

    // @ManyToMany(() => Task, task => task.depends)
    // dependents: Promise<Task[]>;
}