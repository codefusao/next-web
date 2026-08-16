"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createCategory,
	deleteCategory,
	getCategories,
	type CategoryInput,
	updateCategory,
} from "@/api/categories";

const categoryQueryKey = ["categories"] as const;

export function useCategoriesQuery() {
	return useQuery({ queryKey: categoryQueryKey, queryFn: getCategories, staleTime: 30_000 });
}

function useCategoryInvalidation() {
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: categoryQueryKey });
}

export function useCreateCategoryMutation() {
	const invalidate = useCategoryInvalidation();
	return useMutation({ mutationFn: (input: CategoryInput) => createCategory(input), onSuccess: invalidate });
}

export function useUpdateCategoryMutation() {
	const invalidate = useCategoryInvalidation();
	return useMutation({ mutationFn: ({ id, input }: { id: string; input: CategoryInput }) => updateCategory(id, input), onSuccess: invalidate });
}

export function useDeleteCategoryMutation() {
	const invalidate = useCategoryInvalidation();
	return useMutation({ mutationFn: deleteCategory, onSuccess: invalidate });
}
