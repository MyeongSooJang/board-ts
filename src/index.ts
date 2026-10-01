import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { env } from "./config/env";

dotenv.config();

console.log(env.port, env.db.port, typeof env.db.port);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
