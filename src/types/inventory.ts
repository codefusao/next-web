import type { Product } from "@/types/product";

export type InventoryItem = Product & {
	stockId: string;
	quantity: number;
	availableQuantity: number;
};
