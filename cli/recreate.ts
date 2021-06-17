import "reflect-metadata";
import { createConnection } from "typeorm";
import config from "../config";
import { User } from "../models/account/User";


function main() {
    new User();
    createConnection({
        ...config.db,
        dropSchema: true,
        synchronize: true
    }).then(connection => {
        connection.close();
    });
}

main();