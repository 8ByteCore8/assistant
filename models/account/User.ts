import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AbstractUser } from ".";
import { Group } from "../Group";
import { Attempt } from "../project/Attempt";

/**
 * Учётные записи пользователей.
 */
@Entity()
export class User extends AbstractUser {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 50,
        nullable: true,
    })
    public name: string;

    @Column({
        length: 50,
        nullable: true,
    })
    public lastname: string;

    @Column({
        length: 50,
        nullable: true,
    })
    public surname: string;

    @Column({
        length: 255,
        nullable: true,
    })
    public email: string;

    @ManyToOne(() => Group, group => group.users)
    public group: Group;

    // @OneToMany(() => Attempt)
    // attempts: Promise<Attempt[]>;
}