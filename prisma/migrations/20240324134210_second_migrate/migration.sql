/*
  Warnings:

  - You are about to drop the column `product_id` on the `Category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_product_id_fkey";

-- DropIndex
DROP INDEX "Category_product_id_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "product_id",
ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "thumbnail" SET DEFAULT 'https://ik.imagekit.io/wridvl3du/placeholder-image.png?updatedAt=1705139445601';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_id_key" ON "Product"("category_id");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
