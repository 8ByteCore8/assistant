import "reflect-metadata";
import { compare, hash } from "bcryptjs";
import { Column, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Model } from "..";
import { Permission } from "./Permission";
import { Role } from "./Role";

/**
 * Абстаркное представление пользователя необходимое для базового взаимодействия.
 */
export abstract class AbstractUser extends Model {

    @Column({
        length: 50,
        unique: true
    })
    public login: string;

    @Column({
        length: 60,
    })
    public password: string;

    @Column({
        default: true,
        select: false
    })
    public active: boolean;

    @ManyToOne(() => Role, role => role.users, {
        nullable: true,
    })
    public role: Promise<Role>;

    @ManyToMany(() => Permission, {
    })
    @JoinTable()
    public permissions: Promise<Permission[]>;

    @Column({
        default: false,
    })
    public superuser: boolean;

    public static async getAllPermissions<T extends AbstractUser>(user: T): Promise<Permission[]> {

        let permissions = await user.permissions;

        let role = await user.role;
        if (role)
            permissions = permissions.concat(await role.permissions);

        return permissions;
    }

    /**
     * Меняет пароль пользователя.
     * @param user Пользователь.
     * @param password Новый пароль.
     * @returns Пользователь с изменённым паролем.
     */
    public static async setPassword<T extends AbstractUser>(user: T, password: string): Promise<T> {
        user.password = await hash(password, 10);
        return user;
    }

    /**
     * Сравнивает пароль с текущим паролем пользователя.
     * @param user Пользователь.
     * @param password Пароль для проверки.
     * @returns true - пароль совпадает с паролем пользователя, иначе - false.
     */
    public static async checkPassword<T extends AbstractUser>(user: T, password: string): Promise<Boolean> {
        return compare(password, user.password);
    }
}