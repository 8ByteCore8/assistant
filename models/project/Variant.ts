import { Column, Entity, ManyToOne } from "typeorm";
import { Model } from "..";
import { User } from "../account/User";
import { Project } from "./Project";

@Entity({
    name: "variants",
})
export default class Variant extends Model {

    @ManyToOne(() => Project, project => project.variants, {
        primary: true,
    })
    project: Promise<Project>;

    @ManyToOne(() => User, user => user.variants, {
        primary: true,
    })
    user: Promise<User>;

    @Column({
        name: "data",
        length: 2000,
    })
    data: string;
}