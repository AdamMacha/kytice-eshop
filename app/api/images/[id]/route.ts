import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const image = await db.uploadedImage.findUnique({
      where: { id },
    });

    if (!image) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    let outputData = Buffer.from(image.data);
    let contentType = image.mimeType || "image/jpeg";

    // Automatically optimize legacy uncompressed images in DB once on first load
    if (
      contentType !== "image/webp" &&
      contentType !== "image/svg+xml" &&
      contentType !== "image/gif"
    ) {
      try {
        const optimized = await sharp(outputData)
          .rotate()
          .resize({
            width: 1200,
            height: 1500,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })
          .toBuffer();

        outputData = optimized;
        contentType = "image/webp";

        await db.uploadedImage.update({
          where: { id },
          data: {
            data: new Uint8Array(optimized),
            mimeType: "image/webp",
          },
        });
      } catch (optimizeErr) {
        console.warn("[Lazy Optimize Uploaded Image Fallback]:", optimizeErr);
      }
    }

    return new NextResponse(new Uint8Array(outputData), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Get Uploaded Image Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
