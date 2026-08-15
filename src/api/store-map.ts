import { z } from "zod";
import { apiRequest } from "@/api/client";
import type { StoreMap, StoreMapReferencePoint } from "@/types/store-map";

const referencePointSchema = z.object({
	x: z.number(),
	y: z.number(),
	latitude: z.number(),
	longitude: z.number(),
});

const storeMapSchema = z.object({
	id: z.uuid(),
	companyId: z.uuid(),
	name: z.string(),
	imageUrl: z.url(),
	referencePoints: z.array(referencePointSchema).nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

type SaveStoreMapInput = {
	companyId: string;
	imageUrl: string;
};

export type UpdateStoreMapInput = {
	imageUrl?: string;
	referencePoints?: StoreMapReferencePoint[];
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
	input: UpdateStoreMapInput,
): Promise<StoreMap> {
	return apiRequest(`/store-map/${storeMapId}`, storeMapSchema, {
		method: "PUT",
		body: input,
	});
}
