import { create } from "zustand";
import { defaultStoreMetadata } from "@/constants/store";
import mockStores from "@/data/mock-stores.json";
import type { StoreFields, UpdateStoreFields } from "@/schemas/store";
import type { StoreListItem } from "@/types/store";

type StoresState = {
	stores: StoreListItem[];
	addStore: (store: StoreFields) => void;
	updateStore: (storeId: string, changes: UpdateStoreFields) => void;
	updateStoreBanner: (storeId: string, bannerUrl: string) => void;
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
			stores: [{ id: crypto.randomUUID(), ...store }, ...state.stores],
		})),
	updateStore: (storeId, changes) =>
		set((state) => ({
			stores: state.stores.map((store) =>
				store.id === storeId
					? {
							...store,
							...changes,
							...(changes.cnpj === undefined ? { cnpj: store.cnpj } : {}),
						}
					: store,
			),
		})),
	updateStoreBanner: (storeId, bannerUrl) =>
		set((state) => ({
			stores: state.stores.map((store) =>
				store.id === storeId ? { ...store, bannerUrl } : store,
			),
		})),
	removeStore: (storeId) =>
		set((state) => ({
			stores: state.stores.filter((store) => store.id !== storeId),
		})),
}));
