import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { InventoryItem } from "@/types/inventory";
import type { PaginationMeta, ProductOrder } from "@/types/product";

const stockSchema = z.object({
	id: z.string().uuid(),
	companyId: z.string().uuid(),
	quantity: z.number().int(),
	highlight: z.boolean(),
	_count: z.object({ catalogItems: z.number().int() }),
	product: z.object({
		id: z.string().uuid(),
		name: z.string(),
		priceConditions: z.array(z.string()),
		imageUrl: z.string().nullable(),
		category: z.object({ id: z.string().uuid(), name: z.string() }),
	}),
});
const stocksResponseSchema = z.object({
	productStocks: z.array(stockSchema),
	meta: z.object({ totalPages: z.number(), currentPage: z.number(), totalRecords: z.number() }),
});

export type InventoryByProductId = Record<string, number>;
export type UpdateInventoryInput = {
	storeId: string;
	stockId: string;
	quantity?: number;
	highlight?: boolean;
};
export type CreateInventoryInput = { storeId: string; productId: string; quantity: number };
export type InventoryQuery = {
	query?: string;
	categoryId?: string;
	order?: ProductOrder;
	page?: number;
	limit?: number;
};
export type InventoryResult = { products: InventoryItem[]; meta: PaginationMeta };

function toInventoryItem(stock: z.infer<typeof stockSchema>): InventoryItem {
	return {
		id: stock.product.id,
		stockId: stock.id,
		nome: stock.product.name,
		categoria: { id: stock.product.category.id, label: stock.product.category.name },
		precos_e_condicoes: stock.product.priceConditions,
		image: stock.product.imageUrl,
		quantity: stock.quantity,
		availableQuantity: Math.max(stock.quantity - stock._count.catalogItems, 0),
		highlight: stock.highlight,
	};
}

export async function getInventory(
	storeId: string,
	{ query = "", categoryId, order = "name", page = 1, limit = 10 }: InventoryQuery = {},
): Promise<InventoryResult> {
	const search = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		companyId: storeId,
		order,
	});
	if (query.trim()) search.set("query", query.trim());
	if (categoryId) search.set("categoryId", categoryId);
	const response = await apiRequest(
		`/product-stock?${search.toString()}`,
		stocksResponseSchema,
	);
	return { products: response.productStocks.map(toInventoryItem), meta: response.meta };
}

export async function createInventory(input: CreateInventoryInput): Promise<InventoryItem> {
	const stock = await apiRequest("/product-stock", stockSchema, {
		method: "POST",
		body: { companyId: input.storeId, productId: input.productId, quantity: input.quantity },
	});
	return toInventoryItem(stock);
}

export async function updateInventory(input: UpdateInventoryInput): Promise<InventoryItem> {
	const stock = await apiRequest(`/product-stock/${input.stockId}`, stockSchema, {
		method: "PUT",
		body: {
			...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
			...(input.highlight !== undefined ? { highlight: input.highlight } : {}),
		},
	});
	return toInventoryItem(stock);
}
