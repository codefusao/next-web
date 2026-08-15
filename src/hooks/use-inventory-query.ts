"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getInventory,
	type CreateInventoryInput,
	type UpdateInventoryInput,
	createInventory,
	updateInventory,
} from "@/api/inventory";
import { queryKeys } from "@/api/query-keys";
import type { InventoryQuery } from "@/api/inventory";

export function useInventoryQuery(
	storeId: string,
	{ query = "", page = 1, limit = 10 }: InventoryQuery = {},
) {
	return useQuery({
		queryKey: queryKeys.companies.inventory(storeId, query, page),
		queryFn: () => getInventory(storeId, { query, page, limit }),
		staleTime: 30_000,
	});
}

export function useUpdateInventoryMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateInventory,
		onSuccess: (_, { storeId }: UpdateInventoryInput) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.companies.inventory(storeId),
			});
		},
	});
}

export function useCreateInventoryMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateInventoryInput) => createInventory(input),
		onSuccess: (_, { storeId }) =>
			queryClient.invalidateQueries({ queryKey: queryKeys.companies.inventory(storeId) }),
	});
}
