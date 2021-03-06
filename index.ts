import { createConnection } from "typeorm";
import express from "express";
import config from "./config";
import apiRouter from "./routers/api.router";
import { runAttemptsValidation } from "./validator";

async function main() {
    await createConnection(config.db);

    const app = express();

    app.use("/api", apiRouter);

    setInterval(runAttemptsValidation, config.validator.sleep);

    app.listen(config.port, () => console.log("Server started."));
}


main();