import "reflect-metadata";
import Joi from "joi";
import { createConnection, DeepPartial, getRepository } from "typeorm";
import { cli } from ".";
import config from "../config";
import { User } from "../models/account/User";
import { Role } from "../models/account/Role";


const schema = Joi.object({
    login: Joi.string().trim().not("").max(50).alphanum().required(),
    password: Joi.string().trim().min(8).required(),

    name: Joi.string().trim().not("").max(50).alphanum().default(null),
    lastname: Joi.string().trim().not("").max(50).alphanum().default(null),
    surname: Joi.string().trim().not("").max(50).alphanum().default(null),
    email: Joi.string().trim().email().default(null),
}).required();

async function CreateSuperUser(user_data: DeepPartial<User>) {
    user_data = await schema.validateAsync(user_data, {
        convert: true,
        stripUnknown: true,
    });

    const repository = getRepository(User);
    const roleRepository = getRepository(Role);

    let user = repository.create(user_data);
    user.active = true;
    user.superuser = true;
    
    user.role = await roleRepository.findOneOrFail({
        where: {
            "name": "Admins"
        }
    });
    
    user = await User.setPassword(user, user_data["password"]);
    user = await repository.save(user);

    console.log("Created user:\n", user);
}

async function main() {
    new User();
    let connection = await createConnection(config.db);


    cli.question("Login (root): ", login => {
        login = login || "root";

        cli.question("Password (00000000): ", password => {
            password = password || "00000000";
            CreateSuperUser({
                login,
                password
            }).then(() => {
                connection.close().then(() => {
                    cli.close();
                });
            });
        });
    });


}

main();