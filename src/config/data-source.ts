import { env } from "./env";
import { DataSource } from "typeorm";
import { Member } from "../member/entity/Member";
import { Board } from "../board/entity/Board";

export const database = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: true,
  entities: [Member, Board],
});
