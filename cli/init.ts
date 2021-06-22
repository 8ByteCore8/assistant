import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Permissions } from "..";
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
            "name": Permissions.student
        }, {
            "name": Permissions.teacher
        }, {
            "name": Permissions.admin
        }
    ]));


    console.log(permissions);



    const roles = await repositories["role"].save(repositories["role"].create([
        {
            "name": "Students",
            "permissions": <any>[
                permissions[0],
            ]
        }, {
            "name": "Teachers",
            "permissions": <any>[
                permissions[1],
            ]
        }, {
            "name": "Admins",
            "permissions": <any>[
                permissions[2],
            ]
        }
    ]));

    console.log(roles);

}

main();