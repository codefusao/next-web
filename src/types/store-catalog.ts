import type { Product } from "@/types/product";

export type StoreMapPosition = {
	x: number;
	y: number;
};

export type StoreCatalogLocation = StoreMapPosition & {
	id: string;
	description: string;
};

export type StoreCatalogItem = {
	productId: string;
	locations: StoreCatalogLocation[];
};

export type StoreCatalogByStoreId = Record<string, StoreCatalogItem[]>;

export type CatalogProduct = Product & {
	locations: readonly StoreCatalogLocation[];
};

export type CatalogProductEntry = Product & {
	location: StoreCatalogLocation;
};
