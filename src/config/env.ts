import dotenv from "dotenv";

dotenv.config(); // env를 읽어서 process.env에 넣어줌

function required(key: string): string {
  const value = process.env[key];

  if (value === undefined || value === "") {
    throw new Error(`${key}가 존재하지 않습니다.`);
  }

  return value;
}

export const env = {
  port: parseInt(process.env.PORT ?? "8080", 10),
  db: {
    port: parseInt(required("DB_PORT"), 10),
    host: required("DB_HOST"),
    database: required("DB_DATABASE"),
    username: required("DB_USERNAME"),
    password: required("DB_PASSWORD"),
  },
  jwt: {
    secret: required("JWT_SECRET"),
  },
};
