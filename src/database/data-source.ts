import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database ok");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });
