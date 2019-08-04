"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const env = require("dotenv");
env.config();
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
});
connection.connect();
exports.default = connection;
//# sourceMappingURL=MySQLConnection.js.map