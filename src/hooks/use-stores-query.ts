"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialStores } from "@/api/mock-data";
import { queryKeys } from "@/api/query-keys";
import {
	createStore,
	deleteStore,
	getStores,
	type UpdateStoreInput,
	updateStore,
} from "@/api/stores";
import type { StoreFields } from "@/schemas/store";
import type { StoreListItem } from "@/types/store";

export function useStoresQuery() {
	return useQuery({
		queryKey: queryKeys.stores.all,
		queryFn: getStores,
		initialData: initialStores,
		staleTime: Infinity,
	});
}

export function useCreateStoreMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: StoreFields) => createStore(input),
		onSuccess: (store) => {
			queryClient.setQueryData<StoreListItem[]>(
				queryKeys.stores.all,
				(stores) => [store, ...(stores ?? [])],
			);
		},
	});
}

type UpdateStoreVariables = {
	store: StoreListItem;
	changes: UpdateStoreInput;
};

export function useUpdateStoreMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ store, changes }: UpdateStoreVariables) =>
			updateStore(store, changes),
		onSuccess: (updatedStore) => {
			queryClient.setQueryData<StoreListItem[]>(
				queryKeys.stores.all,
				(stores) =>
					(stores ?? []).map((store) =>
						store.id === updatedStore.id ? updatedStore : store,
					),
			);
		},
	});
}

export function useDeleteStoreMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteStore,
		onSuccess: (storeId) => {
			queryClient.setQueryData<StoreListItem[]>(
				queryKeys.stores.all,
				(stores) => (stores ?? []).filter((store) => store.id !== storeId),
			);
			queryClient.removeQueries({
				queryKey: queryKeys.stores.inventory(storeId),
			});
			queryClient.removeQueries({
				queryKey: queryKeys.stores.catalog(storeId),
			});
		},
	});
}
