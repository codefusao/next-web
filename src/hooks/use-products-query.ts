"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type CreateProductInput,
	createProduct,
	getProduct,
	getProducts,
} from "@/api/products";
import { queryKeys } from "@/api/query-keys";
import type { ProductListQuery } from "@/types/product";

export function useProductsQuery(
	{ query = "", categoryId = "", order = "name", page = 1, limit = 10, notInCompanyId }: ProductListQuery = {},
	enabled = true,
) {
	return useQuery({
		queryKey: queryKeys.products.list(query, categoryId, order, page, notInCompanyId),
		queryFn: () => getProducts({ query, categoryId, order, page, limit, notInCompanyId }),
		staleTime: 30_000,
		enabled,
	});
}

export function useProductQuery(productId: string) {
	return useQuery({
		queryKey: queryKeys.products.byId(productId),
		queryFn: () => getProduct(productId),
		staleTime: 30_000,
	});
}

export function useCreateProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateProductInput) => createProduct(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
		},
	});
}
