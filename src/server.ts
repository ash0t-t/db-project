import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import cors from "cors";
import { parse } from "pg-connection-string";

import enterprisesRouter from "./routes/enterprises.js";
import productsRouter from "./routes/products.js";
import suppliesRouter from "./routes/supplies.js";

dotenv.config();
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);
const dbUrl = process.env.DATABASE_URL!;
const dbConfig = parse(dbUrl);

async function main() {
  try {
    const adapter = new PrismaPg({
      host: dbConfig.host,
      port: dbConfig.port ? Number(dbConfig.port) : undefined,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });
    const prisma = new PrismaClient({ adapter });
    const app = express();
    const port = Number(process.env.PORT || 3000);

    app.use(cors());
    app.use(express.json());
    app.use("/enterprises", enterprisesRouter(prisma));
    app.use("/products", productsRouter(prisma));
    app.use("/supplies", suppliesRouter(prisma));

    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    });
  } catch (err) {
    console.error("Fatal startup error:", err);
    process.exit(1);
  }
}

main();