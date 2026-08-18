/** Result from the Packeta Widget v6 pickup point selection */
export interface PacketaPickupPoint {
  id: string;
  name: string;
  city: string;
  street: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  openingHours: string;
  photo?: string;
}

/** Request body for Packeta createPacket API */
export interface PacketaCreatePacketRequest {
  number: string; // our order number
  name: string;
  surname: string;
  email: string;
  phone: string;
  addressId?: number; // pickup point ID
  street?: string;
  city?: string;
  zip?: string;
  value: number; // declared value in CZK
  weight: number; // weight in kg
  cod?: number; // COD amount in CZK (if applicable)
  eshop: string; // sender/eshop identifier
}

/** Response from Packeta createPacket API */
export interface PacketaCreatePacketResponse {
  id: string;
  barcode: string;
  barcodeText: string;
  trackingUrl: string;
}

/** Packeta webhook status update */
export interface PacketaStatusUpdate {
  packetId: string;
  status: string;
  statusText: string;
  dateTime: string;
}

/** Packeta Widget v6 configuration */
export interface PacketaWidgetConfig {
  apiKey: string;
  country: string;
  language: string;
  appIdentity: string;
}
