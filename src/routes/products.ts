import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export default function (prisma: PrismaClient) {
  const router = Router();

  router.post("/", async (req, res) => {
    const data = req.body;
    const created = await prisma.product.create({ data });

    res.status(201).json(created);
  });

  router.get("/", async (req, res) => {
    const q = req.query;
    const where: any = {};
    if (q.name) where.fullName = { contains: String(q.name), mode: "insensitive" };
    const orderBy = q.sort ? { [String(q.sort)]: q.order === "asc" ? "asc" : "desc" } : undefined;
    const list = await prisma.product.findMany({ where, orderBy });

    res.json(list);
  });

  router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.product.findUnique({ where: { id } });
    if (!item) return res.status(404).end();

    res.json(item);
  });

  router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await prisma.product.update({ where: { id }, data });

    res.json(updated);
  });

  router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });

    res.status(204).end();
  });

  return router;
}