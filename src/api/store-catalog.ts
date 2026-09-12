import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import type { PaginationMeta, ProductOrder } from "@/types/product";
import type { StoreCatalogProduct } from "@/types/store-catalog";

const catalogItemSchema = z.object({
	id: z.string().uuid(),
	productStockId: z.string().uuid(),
	quantity: z.number().int().positive(),
	productStock: z.object({
		quantity: z.number().int().nonnegative(),
		catalogItems: z.array(
			z.object({
				id: z.string().uuid(),
				quantity: z.number().int().positive(),
			}),
		),
		product: z.object({ id: z.string().uuid() }),
	}),
	location: z.object({
		id: z.string().uuid(),
		departmentId: z.string().uuid(),
		aisle: z.string(),
		shelf: z.string(),
		module: z.string(),
		level: z.string(),
		mapNodes: z.array(
			z.object({ id: z.string().uuid(), x: z.number(), y: z.number() }),
		),
	}),
});
const catalogProductStockSchema = z.object({
	id: z.string().uuid(),
	quantity: z.number().int().nonnegative(),
	product: z.object({ id: z.string().uuid() }),
	catalogItems: z.array(
		z.object({
			id: z.string().uuid(),
			quantity: z.number().int().positive(),
			location: catalogItemSchema.shape.location,
		}),
	),
});
const catalogProductsResponseSchema = z.object({
	productStocks: z.array(catalogProductStockSchema),
	meta: z.object({
		totalPages: z.number(),
		currentPage: z.number(),
		totalRecords: z.number(),
	}),
});
const fixedLocationSchema = z.object({ id: z.string().uuid() });
const mapNodeSchema = z.object({ id: z.string().uuid() });

function locationLabel(location: {
	aisle: string;
	shelf: string;
	module: string;
	level: string;
}) {
	return `Corredor ${location.aisle} · Prateleira ${location.shelf} · Módulo ${location.module} · Nível ${location.level}`;
}

export type CreateStoreCatalogProductInput = {
	storeId: string;
	storeMapId: string;
	productStockId: string;
	quantity: number;
	location: StoreCatalogLocationFields;
};
export type UpdateStoreCatalogProductInput = {
	storeId: string;
	catalogProductId: string;
	location: StoreCatalogLocationFields;
};
export type RemoveStoreCatalogProductInput = {
	storeId: string;
	catalogProductId: string;
};
export type UpdateStoreCatalogProductQuantityInput = {
	storeId: string;
	catalogProductId: string;
	quantity: number;
};
export type UpdateStoreCatalogProductResult = Pick<
	StoreCatalogProduct,
	"id" | "location" | "quantity" | "maxQuantity"
>;
export type StoreCatalogQuery = {
	page?: number;
	limit?: number;
	query?: string;
	categoryId?: string;
	order?: ProductOrder;
};
export type StoreCatalogResult = {
	products: StoreCatalogProduct[];
	meta: PaginationMeta;
};

function toCatalogProduct(
	item: z.infer<typeof catalogItemSchema>,
): StoreCatalogProduct {
	const node = item.location.mapNodes[0];
	if (!node)
		throw new Error("A localização do catálogo não possui posição no mapa.");
	return {
		id: item.id,
		referenceProductId: item.productStock.product.id,
		quantity: item.quantity,
		maxQuantity:
			item.productStock.quantity -
			item.productStock.catalogItems
				.filter((catalogItem) => catalogItem.id !== item.id)
				.reduce((sum, catalogItem) => sum + catalogItem.quantity, 0),
		location: {
			x: node.x,
			y: node.y,
			description: locationLabel(item.location),
			departmentId: item.location.departmentId,
			aisle: item.location.aisle,
			shelf: item.location.shelf,
			module: item.location.module,
			level: item.location.level,
		},
	};
}

function toCatalogProducts(
	stock: z.infer<typeof catalogProductStockSchema>,
): StoreCatalogProduct[] {
	return stock.catalogItems.map((item) => {
		const node = item.location.mapNodes[0];
		if (!node)
			throw new Error("A localização do catálogo não possui posição no mapa.");
		return {
			id: item.id,
			referenceProductId: stock.product.id,
			quantity: item.quantity,
			maxQuantity:
				stock.quantity -
				stock.catalogItems
					.filter((catalogItem) => catalogItem.id !== item.id)
					.reduce((sum, catalogItem) => sum + catalogItem.quantity, 0),
			location: {
				x: node.x,
				y: node.y,
				description: locationLabel(item.location),
				departmentId: item.location.departmentId,
				aisle: item.location.aisle,
				shelf: item.location.shelf,
				module: item.location.module,
				level: item.location.level,
			},
		};
	});
}

export async function getStoreCatalog(
	storeId: string,
	{
		page = 1,
		limit = 6,
		query = "",
		categoryId,
		order = "name",
	}: StoreCatalogQuery = {},
): Promise<StoreCatalogResult> {
	const search = new URLSearchParams({
		page: String(page),
		limit: String(limit),
		companyId: storeId,
		order,
		catalogOnly: "true",
	});
	if (query.trim()) search.set("query", query.trim());
	if (categoryId) search.set("categoryId", categoryId);
	const response = await apiRequest(
		`/product-stock?${search.toString()}`,
		catalogProductsResponseSchema,
	);
	return {
		products: response.productStocks.flatMap(toCatalogProducts),
		meta: response.meta,
	};
}

export async function createStoreCatalogProduct(
	input: CreateStoreCatalogProductInput,
): Promise<StoreCatalogProduct> {
	const location = await apiRequest("/fixed-location", fixedLocationSchema, {
		method: "POST",
		body: {
			companyId: input.storeId,
			departmentId: input.location.departmentId,
			aisle: input.location.aisle,
			shelf: input.location.shelf,
			module: input.location.module,
			level: input.location.level,
		},
	});
	await apiRequest("/map-node", mapNodeSchema, {
		method: "POST",
		body: {
			mapId: input.storeMapId,
			locationId: location.id,
			name: locationLabel(input.location),
			x: input.location.x,
			y: input.location.y,
		},
	});
	return toCatalogProduct(
		await apiRequest("/product-stock-location", catalogItemSchema, {
			method: "POST",
			body: {
				productStockId: input.productStockId,
				locationId: location.id,
				quantity: input.quantity,
			},
		}),
	);
}

export async function updateStoreCatalogProduct(
	input: UpdateStoreCatalogProductInput,
): Promise<UpdateStoreCatalogProductResult> {
	const item = await apiRequest(
		`/product-stock-location/${input.catalogProductId}`,
		catalogItemSchema,
	);
	const node = item.location.mapNodes[0];
	if (!node)
		throw new Error("A localização do catálogo não possui posição no mapa.");
	await apiRequest(`/fixed-location/${item.location.id}`, fixedLocationSchema, {
		method: "PUT",
		body: {
			departmentId: input.location.departmentId,
			aisle: input.location.aisle,
			shelf: input.location.shelf,
			module: input.location.module,
			level: input.location.level,
		},
	});
	await apiRequest(`/map-node/${node.id}`, mapNodeSchema, {
		method: "PUT",
		body: {
			name: locationLabel(input.location),
			x: input.location.x,
			y: input.location.y,
		},
	});
	return {
		id: input.catalogProductId,
		quantity: item.quantity,
		maxQuantity: toCatalogProduct(item).maxQuantity,
		location: { ...input.location, description: locationLabel(input.location) },
	};
}

export async function updateStoreCatalogProductQuantity(
	input: UpdateStoreCatalogProductQuantityInput,
): Promise<Pick<StoreCatalogProduct, "id" | "quantity" | "maxQuantity">> {
	const item = await apiRequest(
		`/product-stock-location/${input.catalogProductId}`,
		catalogItemSchema,
		{ method: "PUT", body: { quantity: input.quantity } },
	);
	const product = toCatalogProduct(item);
	return {
		id: product.id,
		quantity: product.quantity,
		maxQuantity: product.maxQuantity,
	};
}

export async function removeStoreCatalogProduct(
	input: RemoveStoreCatalogProductInput,
): Promise<RemoveStoreCatalogProductInput> {
	await apiRequest(
		`/product-stock-location/${input.catalogProductId}`,
		z.unknown(),
		{ method: "DELETE" },
	);
	return input;
}
