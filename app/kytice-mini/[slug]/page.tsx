import { permanentRedirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MiniBouquetSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(ROUTES.product(slug));
}
