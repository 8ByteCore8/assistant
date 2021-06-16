import { randomBytes } from "crypto";
import { join } from "path/posix";
import { env } from "process";
import { ConnectionOptions } from "typeorm";
import { CorsOptions } from "cors";

/**
 * Режим разработчика.
 */
const DEBUG: boolean = true;

/**
 * Генерирует сессионый секретный ключ.
 * @returns Сессионый секретный ключ.
 */
function createSecret(): string {
    return randomBytes(4096).toString();
}

/**
 * Загружает межсессионный секретный ключ.
 * @returns Межсессионый секретный ключ.
 */
function getStaticSecret(): string {
    if (!("STATIC_SECRET" in env) && DEBUG)
        env["STATIC_SECRET"] = randomBytes(4096).toString();
    else
        throw Error("Invalid static secret string");
    return env["STATIC_SECRET"];
}

/**
 * Конфигурции.
 */
export type AppConfig = {

    /**
     * Ключ для идентификации режима разработчика.
     */
    debug: boolean;

    /**
     * Порт на котором будет запущен сервер.
     */
    port: number;

    /**
     * Конфигкрации подключения к БД. (TypeOrm)
     */
    db: ConnectionOptions;

    /**
     * Сессионый секретный ключ.
     */
    secret: string;

    /**
     * Межсессионый секретный ключ.
     */
    static_secret: string;

    /**
     * Конфигурации политики CORS.
     */
    cors?: CorsOptions;
};

/**
 * Конфигурации по умолчанию.
 */
const config: AppConfig = {
    debug: DEBUG,
    port: 8000,
    secret: createSecret(),
    static_secret: getStaticSecret(),
    db: {
        type: "sqlite",
        database: "db.sqlite3",
        entities: [
            join(__dirname, "./models/**/*.{js,ts}"),
        ],
        migrations: [
            join(__dirname, "./migrations/**/*.{js,ts}"),
        ],
        subscribers: [
            join(__dirname, "./subscribers/**/*.{js,ts}"),
        ],
        cli: {
            entitiesDir: join(__dirname, "./models"),
            migrationsDir: join(__dirname, "./migrations"),
            subscribersDir: join(__dirname, "./subscribers"),
        },
        // synchronize: DEBUG,
        // dropSchema: DEBUG,
    }
};

export default config;