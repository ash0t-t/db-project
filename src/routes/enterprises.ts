import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default function (prisma: PrismaClient) {
  const router = Router();

  router.post("/", async (req, res) => {
    const data = req.body;
    const created = await prisma.enterprise.create({ data });

    res.status(201).json(created);
  });

  router.get("/", async (req, res) => {
    const q = req.query;
    const where: any = {};
    if (q.name) where.name = { contains: String(q.name), mode: "insensitive" };
    if (q.minEmployees) where.employeesCount = { gte: Number(q.minEmployees) };
    const list = await prisma.enterprise.findMany({ where, orderBy: q.sort ? { [String(q.sort)]: "asc" } : undefined });

    res.json(list);
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.enterprise.findUnique({ where: { id } });
    if (!item) return res.status(404).end();

    res.json(item);
  });

  router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await prisma.enterprise.update({ where: { id }, data });

    res.json(updated);
  });

  router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.enterprise.delete({ where: { id } });

    res.status(204).end();
  });

  return router;
}