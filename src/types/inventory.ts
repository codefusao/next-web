import type { Product } from "@/types/product";

export type InventoryItem = Product & {
	quantity: number;
};
