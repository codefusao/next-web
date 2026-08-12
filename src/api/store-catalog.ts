import { initialStoreCatalog } from "@/api/mock-data";
import { serverOperationNotConfigured } from "@/api/server-operation-not-configured";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import type { StoreCatalogProduct } from "@/types/store-catalog";

export type CreateStoreCatalogProductInput = {
	storeId: string;
	referenceProductId: string;
	location: StoreCatalogLocationFields;
};

export type UpdateStoreCatalogProductInput = {
	storeId: string;
	catalogProductId: string;
	location: StoreCatalogLocationFields;
};

export type UpdateStoreCatalogProductResult = Pick<
	StoreCatalogProduct,
	"id" | "location"
>;

export type RemoveStoreCatalogProductInput = {
	storeId: string;
	catalogProductId: string;
};

export async function getStoreCatalog(
	_storeId: string,
): Promise<StoreCatalogProduct[]> {
	return initialStoreCatalog;
}

export async function createStoreCatalogProduct(
	_input: CreateStoreCatalogProductInput,
): Promise<StoreCatalogProduct> {
	return serverOperationNotConfigured("criação de produto no catálogo");
}

export async function updateStoreCatalogProduct(
	input: UpdateStoreCatalogProductInput,
): Promise<UpdateStoreCatalogProductResult> {
	return {
		id: input.catalogProductId,
		location: input.location,
	};
}

export async function removeStoreCatalogProduct(
	input: RemoveStoreCatalogProductInput,
): Promise<RemoveStoreCatalogProductInput> {
	return input;
}
