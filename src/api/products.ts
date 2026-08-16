import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { Product, ProductListQuery, ProductListResult } from "@/types/product";

const categorySchema = z.object({ id: z.string().uuid(), name: z.string() });
const backendProductSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	unit: z.string(),
	priceConditions: z.array(z.string()),
	imageUrl: z.string().nullable(),
	category: categorySchema,
});
const productsResponseSchema = z.object({
	products: z.array(backendProductSchema),
	meta: z.object({ totalPages: z.number(), currentPage: z.number(), totalRecords: z.number() }),
});

export type CreateProductInput = {
	name: string;
	categoryId: string;
	unit: string;
	priceConditions: string[];
	imageUrl?: string | null;
};

function toProduct(product: z.infer<typeof backendProductSchema>): Product {
	return {
		id: product.id,
		nome: product.name,
		categoria: { id: product.category.id, label: product.category.name },
		precos_e_condicoes: product.priceConditions,
		image: product.imageUrl,
	};
}

export async function getProducts({
	page = 1,
	limit = 10,
	query = "",
	categoryId,
	order = "name",
	notInCompanyId,
}: ProductListQuery = {}): Promise<ProductListResult> {
	const search = new URLSearchParams({ page: String(page), limit: String(limit), order });
	if (query.trim()) search.set("query", query.trim());
	if (categoryId) search.set("categoryId", categoryId);
	if (notInCompanyId) search.set("notInCompanyId", notInCompanyId);
	const response = await apiRequest(`/product?${search.toString()}`, productsResponseSchema);
	return { products: response.products.map(toProduct), meta: response.meta };
}

export async function getProduct(productId: string): Promise<Product> {
	return toProduct(await apiRequest(`/product/${productId}`, backendProductSchema));
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
	return toProduct(
		await apiRequest("/product", backendProductSchema, {
			method: "POST",
			body: input,
		}),
	);
}
