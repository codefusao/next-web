import type { StoreMapPosition } from "@/types/store-catalog";

export type StoreMapMarker = StoreMapPosition & {
	id: string;
	label: string;
	referenceProductId: string;
	productName: string;
	productCategory: string;
	productImage: string | null;
	locationLabel: string;
};

export type MapImageSize = {
	width: number;
	height: number;
};

export const defaultMapImageSize: MapImageSize = { width: 3, height: 2 };
