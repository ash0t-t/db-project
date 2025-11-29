import fetch from "node-fetch";
const base = `http://localhost:${process.env.PORT || 3000}`;
async function post(path: string, body: any) {
  const res = await fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}
async function main() {
  const enterprises = [];
  for (let i = 1; i <= 30; i++) {
    const e = await post("/enterprises", { name: `Enterprise ${i}`, activityType: ["Manufacturing", "Trade", "Services"][i % 3], employeesCount: 10 + i });
    enterprises.push(e);
  }
  const products = [];
  for (let i = 1; i <= 50; i++) {
    const p = await post("/products", { shortName: `P${i}`, fullName: `Product Full Name ${i}`, unit: i % 2 === 0 ? "kg" : "pcs", purchasePrice: 1.5 * i, shelfLifeDays: 365 });
    products.push(p);
  }
  const supplies = [];
  for (let i = 1; i <= 500; i++) {
    const enterpriseId = enterprises[i % enterprises.length].id;
    const productId = products[i % products.length].id;
    const date = new Date();
    date.setDate(date.getDate() - (i % 180));
    await post("/supplies", { enterpriseId, productId, date: date.toISOString(), volume: 10 + (i % 20), salePrice: 2.5 * (i % 10 + 1) });
  }
}
main();