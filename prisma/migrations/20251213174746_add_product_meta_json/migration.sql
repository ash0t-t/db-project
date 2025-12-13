-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "meta" JSONB;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX product_meta_trgm_idx
ON "Product"
USING GIN ((meta::text) gin_trgm_ops);