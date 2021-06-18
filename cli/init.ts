import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import config from "../config";
import { Permission } from "../models/account/Permission";
import { Role } from "../models/account/Role";


async function main() {
    await createConnection({
        ...config.db,
        dropSchema: true,
        synchronize: true
    });

    const repositories = {
        "role": getRepository(Role),
        "permission": getRepository(Permission),
    };

    const permissions = await repositories["permission"].save(repositories["permission"].create([
        {
            "name": "can_register"
        }, {
            "name": "can_register_students"
        }, {
            "name": "can_register_teachers"
        }, {
            "name": "can_create_project"
        }, {
            "name": "can_edit_project"
        }
    ]));


    console.log(permissions);



    const roles = await repositories["role"].save(repositories["role"].create([
        {
            "name": "Students",
        }, {
            "name": "Teachers",
            "permissions": [
                permissions[0],
                permissions[1],
                permissions[3],
                permissions[4],
            ] as any
        }, {
            "name": "Admins",
            "permissions": [
                permissions[0],
                permissions[1],
                permissions[2],
                permissions[3],
                permissions[4],
            ] as any
        }
    ]));

    console.log(roles);

}

main();