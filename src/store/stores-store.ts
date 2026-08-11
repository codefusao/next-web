import { create } from "zustand";
import mockStores from "@/data/mock-stores.json";
import type { StoreFields } from "@/schemas/store";
import type { StoreListItem } from "@/types/store";

type StoresState = {
	stores: StoreListItem[];
	addStore: (store: StoreFields) => void;
	removeStore: (storeId: string) => void;
};

export const useStoresStore = create<StoresState>()((set) => ({
	stores: mockStores,
	addStore: (store) =>
		set((state) => ({
			stores: [{ id: crypto.randomUUID(), ...store }, ...state.stores],
		})),
	removeStore: (storeId) =>
		set((state) => ({
			stores: state.stores.filter((store) => store.id !== storeId),
		})),
}));
