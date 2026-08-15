"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getInventory,
	type InventoryByProductId,
	type UpdateInventoryInput,
	updateInventory,
} from "@/api/inventory";
import { initialStockByStoreId } from "@/api/mock-data";
import { queryKeys } from "@/api/query-keys";

export function useInventoryQuery(storeId: string) {
	return useQuery({
		queryKey: queryKeys.companies.inventory(storeId),
		queryFn: () => getInventory(storeId),
		initialData: initialStockByStoreId[storeId] ?? {},
		staleTime: Infinity,
	});
}

export function useUpdateInventoryMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateInventory,
		onSuccess: ({ storeId, productId, quantity }: UpdateInventoryInput) => {
			queryClient.setQueryData<InventoryByProductId>(
				queryKeys.companies.inventory(storeId),
				(stockByProductId) => ({
					...(stockByProductId ?? {}),
					[productId]: quantity,
				}),
			);
		},
	});
}
