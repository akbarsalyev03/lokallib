import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { executeMockQuery } from "./mockDb.js";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, params) => {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DB_HOST !== "mysql"
  ) {
    return executeMockQuery(sql, params);
  }

  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("MySQL Error:", error.message);
    }
    return executeMockQuery(sql, params);
  }
};

export default pool;
