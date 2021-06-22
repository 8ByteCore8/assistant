import { createConnection } from "typeorm";
import express from "express";
import config from "./config";
import apiRouter from "./routers/api.router";

async function main() {
    await createConnection(config.db);

    const app = express();

    app.use("/api", apiRouter);


    app.listen(config.port, () => console.log("Server started."));
}


main();