import { PrismaClient } from "@prisma/client";
import { Router } from "express";

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