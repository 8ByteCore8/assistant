import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "./User";
import { Permission } from "./Permission";

/**
 * Роли пользователей.
 */
 @Entity({
    name: "roles",
})
export class Role extends Model {

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

    @ManyToMany(() => Permission)
    @JoinTable()
    public permissions: Promise<Permission[]>;

    @OneToMany(() => User, user => user.role)
    public users: Promise<User[]>;
}