import type {
  PacketaCreatePacketRequest,
  PacketaCreatePacketResponse,
} from "@/types/packeta";

const PACKETA_API_URL = "https://www.zasilkovna.cz/api/rest";

/**
 * Creates a packet (shipment) in the Packeta system.
 * Returns packet ID and barcode information.
 */
export async function createPacketaPacket(
  params: PacketaCreatePacketRequest
): Promise<PacketaCreatePacketResponse> {
  const apiPassword = process.env.PACKETA_API_PASSWORD;

  if (!apiPassword) {
    console.warn(
      "[Packeta] PACKETA_API_PASSWORD is not set. Generating mock shipment ID for testing."
    );
    const mockId = `Z${Date.now().toString().slice(-8)}`;
    return {
      id: mockId,
      barcode: mockId,
      barcodeText: mockId,
      trackingUrl: `https://tracking.packeta.com/cs_CZ/?id=${mockId}`,
    };
  }

  try {
    const payload = {
      apiPassword,
      packetAttributes: {
        number: params.number,
        name: params.name,
        surname: params.surname,
        email: params.email,
        phone: params.phone,
        addressId: params.addressId,
        street: params.street,
        city: params.city,
        zip: params.zip,
        value: params.value,
        weight: params.weight,
        cod: params.cod || 0,
        eshop: params.eshop || "MoodBox Bloom",
      },
    };

    const res = await fetch(`${PACKETA_API_URL}/create-packet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Packeta API error (${res.status}): ${errorText}`);
    }

    const data = await res.json();
    return {
      id: data.result.id,
      barcode: data.result.barcode,
      barcodeText: data.result.barcodeText,
      trackingUrl: `https://tracking.packeta.com/cs_CZ/?id=${data.result.id}`,
    };
  } catch (error) {
    console.error("[Packeta] Error creating packet:", error);
    throw error;
  }
}
