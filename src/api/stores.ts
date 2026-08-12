import { initialStores } from "@/api/mock-data";
import { serverOperationNotConfigured } from "@/api/server-operation-not-configured";
import type { StoreFields } from "@/schemas/store";
import type { StoreListItem } from "@/types/store";

export type CreateStoreInput = StoreFields;
export type UpdateStoreInput = Partial<Omit<StoreListItem, "id">>;

export async function getStores(): Promise<StoreListItem[]> {
	return initialStores;
}

export async function createStore(
	_input: CreateStoreInput,
): Promise<StoreListItem> {
	return serverOperationNotConfigured("criação de loja");
}

export async function updateStore(
	store: StoreListItem,
	changes: UpdateStoreInput,
): Promise<StoreListItem> {
	return {
		...store,
		...Object.fromEntries(
			Object.entries(changes).filter(([, value]) => value !== undefined),
		),
	};
}

export async function deleteStore(storeId: string): Promise<string> {
	return storeId;
}
