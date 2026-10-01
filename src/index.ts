import "reflect-metadata";
import express from "express";
import { env } from "./config/env";
import { database } from "./config/data-source";

const app = express();
app.use(express.json());

const PORT = env.port;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

async function bootstrap() {
  try {
    await database.initialize();
    console.log(`${env.db.database} 연결 성공`);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

bootstrap();
