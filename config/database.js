import mysql from 'mysql2/promise';
process.loadEnvFile();
export const conexion = await mysql.createConnection({
  host: process.env.SQL_HOST,
  database: 'reservas',
  user: process.env.SQL_USER_ADMIN,
  password: process.env.SQL_PASSWORD_ADMIN,
});