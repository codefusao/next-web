import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { StoreMap } from "@/types/store-map";

const storeMapSchema = z.object({
	id: z.uuid(),
	companyId: z.uuid(),
	name: z.string(),
	imageUrl: z.url(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

type SaveStoreMapInput = {
	companyId: string;
	imageUrl: string;
};

export function getStoreMapByCompany(
	companyId: string,
): Promise<StoreMap | null> {
	return apiRequest(
		`/store-map/company/${companyId}`,
		storeMapSchema.nullable(),
	);
}

export function createStoreMap(input: SaveStoreMapInput): Promise<StoreMap> {
	return apiRequest("/store-map", storeMapSchema, {
		method: "POST",
		body: { ...input, name: "Mapa principal" },
	});
}

export function updateStoreMap(
	storeMapId: string,
	imageUrl: string,
): Promise<StoreMap> {
	return apiRequest(`/store-map/${storeMapId}`, storeMapSchema, {
		method: "PUT",
		body: { imageUrl },
	});
}
