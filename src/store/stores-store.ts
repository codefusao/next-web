import { create } from "zustand";
import { defaultStoreMetadata } from "@/constants/store";
import mockStores from "@/data/mock-stores.json";
import type { StoreFields } from "@/schemas/store";
import type { StoreListItem } from "@/types/store";

export type StorePatch = Partial<Omit<StoreListItem, "id">>;

type StoresState = {
	stores: StoreListItem[];
	addStore: (store: StoreFields) => void;
	patchStore: (storeId: string, changes: StorePatch) => void;
	removeStore: (storeId: string) => void;
};

const initialStores: StoreListItem[] = mockStores.map((store) => ({
	...store,
	...defaultStoreMetadata,
}));

export const useStoresStore = create<StoresState>()((set) => ({
	stores: initialStores,
	addStore: (store) =>
		set((state) => ({
			stores: [
				{ ...defaultStoreMetadata, id: crypto.randomUUID(), ...store },
				...state.stores,
			],
		})),
	patchStore: (storeId, changes) =>
		set((state) => ({
			stores: state.stores.map((store) =>
				store.id === storeId
					? {
							...store,
							...Object.fromEntries(
								Object.entries(changes).filter(
									([, value]) => value !== undefined,
								),
							),
						}
					: store,
			),
		})),
	removeStore: (storeId) =>
		set((state) => ({
			stores: state.stores.filter((store) => store.id !== storeId),
		})),
}));
