"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialStoreCatalog } from "@/api/mock-data";
import { queryKeys } from "@/api/query-keys";
import {
	type CreateStoreCatalogProductInput,
	createStoreCatalogProduct,
	getStoreCatalog,
	type RemoveStoreCatalogProductInput,
	removeStoreCatalogProduct,
	type UpdateStoreCatalogProductInput,
	type UpdateStoreCatalogProductResult,
	updateStoreCatalogProduct,
} from "@/api/store-catalog";
import type { StoreCatalogProduct } from "@/types/store-catalog";

export function useStoreCatalogQuery(storeId: string) {
	return useQuery({
		queryKey: queryKeys.stores.catalog(storeId),
		queryFn: () => getStoreCatalog(storeId),
		initialData: initialStoreCatalog,
		staleTime: Infinity,
	});
}

export function useCreateStoreCatalogProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createStoreCatalogProduct,
		onSuccess: (
			catalogProduct,
			{ storeId }: CreateStoreCatalogProductInput,
		) => {
			queryClient.setQueryData<StoreCatalogProduct[]>(
				queryKeys.stores.catalog(storeId),
				(catalogProducts) => [...(catalogProducts ?? []), catalogProduct],
			);
		},
	});
}

export function useUpdateStoreCatalogProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateStoreCatalogProduct,
		onSuccess: (
			catalogProductUpdate: UpdateStoreCatalogProductResult,
			{ storeId }: UpdateStoreCatalogProductInput,
		) => {
			queryClient.setQueryData<StoreCatalogProduct[]>(
				queryKeys.stores.catalog(storeId),
				(catalogProducts) =>
					(catalogProducts ?? []).map((item) =>
						item.id === catalogProductUpdate.id
							? { ...item, ...catalogProductUpdate }
							: item,
					),
			);
		},
	});
}

export function useRemoveStoreCatalogProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeStoreCatalogProduct,
		onSuccess: ({
			storeId,
			catalogProductId,
		}: RemoveStoreCatalogProductInput) => {
			queryClient.setQueryData<StoreCatalogProduct[]>(
				queryKeys.stores.catalog(storeId),
				(catalogProducts) =>
					(catalogProducts ?? []).filter(
						(catalogProduct) => catalogProduct.id !== catalogProductId,
					),
			);
		},
	});
}
