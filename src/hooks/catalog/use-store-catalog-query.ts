"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
	type StoreCatalogQuery,
} from "@/api/store-catalog";

export function useStoreCatalogQuery(
	storeId: string,
	{ query = "", categoryId = "", order = "name", page = 1, limit = 10 }: StoreCatalogQuery = {},
) {
	return useQuery({
		queryKey: queryKeys.companies.catalog(storeId, query, categoryId, order, page),
		queryFn: () => getStoreCatalog(storeId, { query, categoryId, order, page, limit }),
		staleTime: 30_000,
	});
}

export function useCreateStoreCatalogProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createStoreCatalogProduct,
		onSuccess: (_, { storeId }: CreateStoreCatalogProductInput) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.companies.catalog(storeId),
			});
			queryClient.invalidateQueries({
				queryKey: queryKeys.companies.inventory(storeId),
			});
		},
	});
}

export function useUpdateStoreCatalogProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateStoreCatalogProduct,
		onSuccess: (_, { storeId }: UpdateStoreCatalogProductInput) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.companies.catalog(storeId),
			});
		},
	});
}

export function useRemoveStoreCatalogProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeStoreCatalogProduct,
		onSuccess: ({ storeId }: RemoveStoreCatalogProductInput) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.companies.catalog(storeId),
			});
		},
	});
}
