// import "reflect-metadata";
// import { DataSource } from "typeorm";
// import { User } from "./entities/User.entity.js";


// const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "Admin@123",
//   database: "auth_system_db",
//   synchronize: true,
//   logging: false,
//   entities: [User],
// });

// export default AppDataSource;


import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.entity.js";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: false,
  entities: [User],
});

export default AppDataSource;