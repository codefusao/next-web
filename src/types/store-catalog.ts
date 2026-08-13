import type { Product } from "@/types/product";

export type StoreMapPosition = {
	x: number;
	y: number;
};

export type StoreCatalogProductLocation = StoreMapPosition & {
	description: string;
};

export type StoreCatalogProduct = {
	id: string;
	referenceProductId: string;
	location: StoreCatalogProductLocation;
};

export type CatalogProduct = Omit<Product, "id"> & {
	id: string;
	referenceProductId: string;
	location: StoreCatalogProductLocation;
};
