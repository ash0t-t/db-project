import { PrismaClient } from "@prisma/client";
import { Router } from "express";

function fixBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, v) => typeof v === "bigint" ? Number(v) : v)
  );
}

export default function (prisma: PrismaClient) {
  const router = Router();

  router.post("/", async (req, res) => {
    const data = req.body;
    const created = await prisma.supply.create({ data });

    res.status(201).json(created);
  });

  router.get("/", async (req, res) => {
    const q = req.query;
    const where: any = {};

    if (q.enterpriseId) where.enterpriseId = Number(q.enterpriseId);
    if (q.productId) where.productId = Number(q.productId);
    if (q.dateFrom || q.dateTo) where.date = {};
    if (q.dateFrom) where.date.gte = new Date(String(q.dateFrom));
    if (q.dateTo) where.date.lte = new Date(String(q.dateTo));

    const page = Number(q.page || 1);
    const perPage = Number(q.perPage || 20);
    const list = await prisma.supply.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: q.sort ? { [String(q.sort)]: "asc" } : { date: "desc" }
    });

    res.json(list);
  });

  router.get("/advanced", async (req, res) => {
    const q = req.query;
    const where: any = {};
    if (q.enterpriseId) where.enterpriseId = Number(q.enterpriseId);
    if (q.productId) where.productId = Number(q.productId);
    if (q.minVolume) where.volume = { gte: Number(q.minVolume) };
    if (q.maxVolume) where.volume = { ...(where.volume || {}), lte: Number(q.maxVolume) };
    if (q.dateFrom || q.dateTo) where.date = {};
    if (q.dateFrom) where.date.gte = new Date(String(q.dateFrom));
    if (q.dateTo) where.date.lte = new Date(String(q.dateTo));
    if (q.minPrice) where.salePrice = { gte: Number(q.minPrice) };
    if (q.maxPrice) where.salePrice = { ...(where.salePrice || {}), lte: Number(q.maxPrice) };
  
    const page = Number(q.page || 1);
    const perPage = Number(q.perPage || 20);
  
    const list = await prisma.supply.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: q.sort ? { [String(q.sort)]: q.order === "asc" ? "asc" : "desc" } : { date: "desc" }
    });
  
    res.json(list);
  });

  router.get("/with-details", async (req, res) => {
    const q = req.query;
    const page = Number(q.page || 1);
    const perPage = Number(q.perPage || 20);
    const list = await prisma.supply.findMany({
      include: { product: true, enterprise: true },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: q.sort ? { [String(q.sort)]: q.order === "asc" ? "asc" : "desc" } : { date: "desc" }
    });
    res.json(list);
  });

  router.post("/adjust-prices", async (req, res) => {
    const { olderThanDays = 90, minVolume = 0, factor = 1.1 } = req.body;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(olderThanDays));
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "Supply" SET "salePrice" = CASE WHEN "salePrice" IS NULL THEN NULL ELSE "salePrice" * $1 END WHERE "date" < $2 AND "volume" > $3`,
      Number(factor),
      cutoff.toISOString(),
      Number(minVolume)
    );
    res.json({ updatedRows: result });
  });

  router.get("/stats/by-product", async (req, res) => {
    const stats = await prisma.$queryRaw`
      SELECT p.id as "productId", p."fullName" as "productName",
        SUM(s.volume)::float as "totalVolume",
        AVG(s."salePrice")::float as "avgPrice",
        COUNT(*) as "records"
      FROM "Supply" s
      JOIN "Product" p ON s."productId" = p.id
      GROUP BY p.id, p."fullName"
      ORDER BY "totalVolume" DESC
    `;
    res.json(fixBigInt(stats));
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.supply.findUnique({ where: { id } });
    if (!item) return res.status(404).end();

    res.json(item);
  });

  router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await prisma.supply.update({ where: { id }, data });

    res.json(updated);
  });

  router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.supply.delete({ where: { id } });

    res.status(204).end();
  });
  
  return router;
}