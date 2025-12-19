import { Sequelize } from "@sequelize/core";

import mysql from "mysql2/promise";

import { MySqlDialect } from "@sequelize/mysql";

const sequelize = new Sequelize({
  dialect: MySqlDialect,
  database: process.env.DB_NAME || "finalschema",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
});

export default sequelize;
