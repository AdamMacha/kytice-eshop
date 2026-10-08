import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

    return new NextResponse(new Uint8Array(image.data), {
      status: 200,
      headers: {
        "Content-Type": image.mimeType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[Get Uploaded Image Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
