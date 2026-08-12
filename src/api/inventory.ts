import { initialStockByStoreId } from "@/api/mock-data";

export type InventoryByProductId = Record<string, number>;

export type UpdateInventoryInput = {
	storeId: string;
	productId: string;
	quantity: number;
};

export async function getInventory(
	storeId: string,
): Promise<InventoryByProductId> {
	return initialStockByStoreId[storeId] ?? {};
}

export async function updateInventory(
	input: UpdateInventoryInput,
): Promise<UpdateInventoryInput> {
	return input;
}
