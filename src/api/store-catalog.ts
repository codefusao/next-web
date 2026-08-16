import { z } from "zod";
import { apiRequest } from "@/api/client";
import { getInventory } from "@/api/inventory";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import type { StoreCatalogProduct } from "@/types/store-catalog";
import type { PaginationMeta, ProductOrder } from "@/types/product";

const catalogItemSchema = z.object({
	id: z.string().uuid(),
	productStockId: z.string().uuid(),
	productStock: z.object({ product: z.object({ id: z.string().uuid() }) }),
	location: z.object({
		id: z.string().uuid(),
		departmentId: z.string().uuid(),
		aisle: z.string(),
		shelf: z.string(),
		module: z.string(),
		level: z.string(),
		mapNodes: z.array(z.object({ id: z.string().uuid(), x: z.number(), y: z.number() })),
	}),
});
const catalogItemsResponseSchema = z.object({
	productStockLocations: z.array(catalogItemSchema),
	meta: z.object({ totalPages: z.number(), currentPage: z.number(), totalRecords: z.number() }),
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
	referenceProductId: string;
	location: StoreCatalogLocationFields;
};
export type UpdateStoreCatalogProductInput = {
	storeId: string;
	catalogProductId: string;
	location: StoreCatalogLocationFields;
};
export type RemoveStoreCatalogProductInput = { storeId: string; catalogProductId: string };
export type UpdateStoreCatalogProductResult = Pick<StoreCatalogProduct, "id" | "location">;
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

function toCatalogProduct(item: z.infer<typeof catalogItemSchema>): StoreCatalogProduct {
	const node = item.location.mapNodes[0];
	if (!node) throw new Error("A localização do catálogo não possui posição no mapa.");
	return {
		id: item.id,
		referenceProductId: item.productStock.product.id,
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

export async function getStoreCatalog(
	storeId: string,
	{ page = 1, limit = 10, query = "", categoryId, order = "name" }: StoreCatalogQuery = {},
): Promise<StoreCatalogResult> {
	const search = new URLSearchParams({ page: String(page), limit: String(limit), companyId: storeId, order });
	if (query.trim()) search.set("query", query.trim());
	if (categoryId) search.set("categoryId", categoryId);
	const response = await apiRequest(
		`/product-stock-location?${search.toString()}`,
		catalogItemsResponseSchema,
	);
	return { products: response.productStockLocations.map(toCatalogProduct), meta: response.meta };
}

export async function createStoreCatalogProduct(input: CreateStoreCatalogProductInput): Promise<StoreCatalogProduct> {
	const inventory = await getInventory(input.storeId);
	const stock = inventory.products.find((item) => item.id === input.referenceProductId);
	if (!stock) throw new Error("Adicione o produto ao inventário antes de localizá-lo.");

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
		body: { mapId: input.storeMapId, locationId: location.id, name: locationLabel(input.location), x: input.location.x, y: input.location.y },
	});
	return toCatalogProduct(
		await apiRequest("/product-stock-location", catalogItemSchema, {
			method: "POST",
			body: { productStockId: stock.stockId, locationId: location.id },
		}),
	);
}

export async function updateStoreCatalogProduct(input: UpdateStoreCatalogProductInput): Promise<UpdateStoreCatalogProductResult> {
	const item = await apiRequest(`/product-stock-location/${input.catalogProductId}`, catalogItemSchema);
	const node = item.location.mapNodes[0];
	if (!node) throw new Error("A localização do catálogo não possui posição no mapa.");
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
		body: { name: locationLabel(input.location), x: input.location.x, y: input.location.y },
	});
	return {
		id: input.catalogProductId,
		location: { ...input.location, description: locationLabel(input.location) },
	};
}

export async function removeStoreCatalogProduct(input: RemoveStoreCatalogProductInput): Promise<RemoveStoreCatalogProductInput> {
	await apiRequest(`/product-stock-location/${input.catalogProductId}`, z.unknown(), { method: "DELETE" });
	return input;
}
