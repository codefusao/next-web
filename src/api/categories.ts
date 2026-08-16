import { z } from "zod";
import { apiRequest } from "@/api/client";

export const categorySchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	parentId: z.string().uuid().nullable(),
});
const categoryListSchema = z.object({
	categories: z.array(categorySchema),
	meta: z.object({ totalPages: z.number(), currentPage: z.number(), totalRecords: z.number() }),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryInput = { name: string; parentId?: string | null };

export async function getCategories(): Promise<Category[]> {
	const response = await apiRequest("/category?page=1&limit=10", categoryListSchema);
	return response.categories;
}

export function createCategory(input: CategoryInput) {
	return apiRequest("/category", categorySchema, { method: "POST", body: input });
}

export function updateCategory(id: string, input: CategoryInput) {
	return apiRequest(`/category/${id}`, categorySchema, { method: "PUT", body: input });
}

export function deleteCategory(id: string) {
	return apiRequest(`/category/${id}`, categorySchema, { method: "DELETE" });
}
