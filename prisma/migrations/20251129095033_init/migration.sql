-- CreateTable
CREATE TABLE "Enterprise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "activityType" TEXT,
    "employeesCount" INTEGER,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "shortName" TEXT NOT NULL,
    "fullName" TEXT,
    "unit" TEXT,
    "purchasePrice" DOUBLE PRECISION,
    "shelfLifeDays" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supply" (
    "id" SERIAL NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION,

    CONSTRAINT "Supply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Supply" ADD CONSTRAINT "Supply_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supply" ADD CONSTRAINT "Supply_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
