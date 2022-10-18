import app from "./app";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { config } from "./config/config";
import path from "path";

const dbOptions: SequelizeOptions = {
    ...config.db,
    modelPaths: [path.join(__dirname, '/models')],
    define: {
        freezeTableName: true,
        timestamps: true,
        paranoid: true,
        underscored: true,
    }
}

const db = new Sequelize(dbOptions);

export async function dbSetup() {
    return db.authenticate();
}