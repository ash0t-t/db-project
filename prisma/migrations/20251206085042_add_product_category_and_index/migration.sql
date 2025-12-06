-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "Supply" ADD COLUMN     "batchNumber" TEXT;

-- CreateIndex
CREATE INDEX "Product_shortName_idx" ON "Product"("shortName");

-- CreateIndex
CREATE INDEX "Supply_enterpriseId_productId_idx" ON "Supply"("enterpriseId", "productId");

-- CreateIndex
CREATE INDEX "Supply_date_idx" ON "Supply"("date");
