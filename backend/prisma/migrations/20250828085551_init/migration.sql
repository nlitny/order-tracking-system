/*
  Warnings:

  - You are about to drop the column `priority` on the `orders` table. All the data in the column will be lost.
  - Made the column `description` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."orders_priority_idx";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "priority",
ADD COLUMN     "special_instructions" TEXT,
ALTER COLUMN "description" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."customer_media" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "cloudinaryId" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "fileType" "public"."FileType" NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_media_orderId_idx" ON "public"."customer_media"("orderId");

-- CreateIndex
CREATE INDEX "customer_media_uploadedBy_idx" ON "public"."customer_media"("uploadedBy");

-- CreateIndex
CREATE INDEX "customer_media_mimeType_idx" ON "public"."customer_media"("mimeType");

-- CreateIndex
CREATE INDEX "customer_media_fileType_idx" ON "public"."customer_media"("fileType");

-- CreateIndex
CREATE INDEX "customer_media_isPublic_idx" ON "public"."customer_media"("isPublic");

-- CreateIndex
CREATE INDEX "customer_media_createdAt_idx" ON "public"."customer_media"("createdAt");

-- CreateIndex
CREATE INDEX "orders_description_idx" ON "public"."orders"("description");

-- AddForeignKey
ALTER TABLE "public"."customer_media" ADD CONSTRAINT "customer_media_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
