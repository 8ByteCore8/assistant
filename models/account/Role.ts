import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Model } from "..";
import { User } from "./User";
import { Permission } from "./Permission";

/**
 * Роли пользователей.
 */
@Entity()
export class Role extends Model {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        unique: true,
    })
    public name: string;

    @ManyToMany(() => Permission)
    @JoinTable()
    public permissions: Permission[];

    @OneToMany(() => User, user => user.role)
    public users: User[];
}