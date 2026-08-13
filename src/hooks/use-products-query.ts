"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { initialProducts } from "@/api/mock-data";
import {
	type CreateProductInput,
	createProduct,
	getProduct,
	getProducts,
} from "@/api/products";
import { queryKeys } from "@/api/query-keys";
import type { Product } from "@/types/product";

export function useProductsQuery(enabled = true) {
	return useQuery({
		queryKey: queryKeys.products.all,
		queryFn: getProducts,
		initialData: initialProducts,
		staleTime: Infinity,
		enabled,
	});
}

export function useProductQuery(productId: string) {
	return useQuery({
		queryKey: queryKeys.products.byId(productId),
		queryFn: () => getProduct(productId),
		staleTime: Infinity,
	});
}

export function useCreateProductMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateProductInput) => createProduct(input),
		onSuccess: (product) => {
			queryClient.setQueryData<Product[]>(
				queryKeys.products.all,
				(products) => [product, ...(products ?? [])],
			);
		},
	});
}
