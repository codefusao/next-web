import { create } from "zustand";
import mockProducts from "@/data/mock-products.json";
import mockStores from "@/data/mock-stores.json";
import { createDemoStockByStoreId, type StockByStoreId } from "@/lib/inventory";

type InventoryState = {
	stockByStoreId: StockByStoreId;
	updateStock: (storeId: string, productId: string, quantity: number) => void;
	removeStoreInventory: (storeId: string) => void;
};

const initialStockByStoreId = createDemoStockByStoreId(
	mockStores,
	mockProducts,
);

export const useInventoryStore = create<InventoryState>()((set) => ({
	stockByStoreId: initialStockByStoreId,
	updateStock: (storeId, productId, quantity) =>
		set((state) => ({
			stockByStoreId: {
				...state.stockByStoreId,
				[storeId]: {
					...state.stockByStoreId[storeId],
					[productId]: quantity,
				},
			},
		})),
	removeStoreInventory: (storeId) =>
		set((state) => {
			const stockByStoreId = { ...state.stockByStoreId };
			delete stockByStoreId[storeId];
			return { stockByStoreId };
		}),
}));
