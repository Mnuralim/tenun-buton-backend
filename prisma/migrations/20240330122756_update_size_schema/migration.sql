-- DropForeignKey
ALTER TABLE "Size" DROP CONSTRAINT "Size_product_id_fkey";

-- DropIndex
DROP INDEX "Size_product_id_key";

-- AlterTable
ALTER TABLE "Size" ALTER COLUMN "product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
