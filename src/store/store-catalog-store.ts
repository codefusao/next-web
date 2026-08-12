import { create } from "zustand";
import type {
	StoreCatalogByStoreId,
	StoreCatalogItem,
	StoreCatalogLocation,
} from "@/types/store-catalog";

export const emptyStoreCatalogItems: StoreCatalogItem[] = [];

type StoreCatalogState = {
	catalogByStoreId: StoreCatalogByStoreId;
	addLocation: (
		storeId: string,
		productId: string,
		position: Omit<StoreCatalogLocation, "id">,
	) => void;
	updateLocation: (
		storeId: string,
		productId: string,
		locationId: string,
		position: Omit<StoreCatalogLocation, "id">,
	) => void;
	removeLocation: (
		storeId: string,
		productId: string,
		locationId: string,
	) => void;
	clearStoreCatalog: (storeId: string) => void;
};

function updateCatalogLocations(
	catalogByStoreId: StoreCatalogByStoreId,
	storeId: string,
	update: (location: StoreCatalogLocation) => StoreCatalogLocation | null,
	productId: string,
	locationId: string,
) {
	const storeCatalog = catalogByStoreId[storeId] ?? emptyStoreCatalogItems;
	const nextCatalog = storeCatalog
		.map((item) => {
			if (item.productId !== productId) return item;
			const locations = item.locations.flatMap((location) => {
				if (location.id !== locationId) return [location];
				const nextLocation = update(location);
				return nextLocation ? [nextLocation] : [];
			});
			return { ...item, locations };
		})
		.filter((item) => item.locations.length > 0);

	return { ...catalogByStoreId, [storeId]: nextCatalog };
}

export const useStoreCatalogStore = create<StoreCatalogState>()((set) => ({
	catalogByStoreId: {},
	addLocation: (storeId, productId, position) =>
		set((state) => {
			const location: StoreCatalogLocation = {
				id: crypto.randomUUID(),
				...position,
			};
			const storeCatalog =
				state.catalogByStoreId[storeId] ?? emptyStoreCatalogItems;
			const productExists = storeCatalog.some(
				(item) => item.productId === productId,
			);
			const nextCatalog = productExists
				? storeCatalog.map((item) =>
						item.productId === productId
							? { ...item, locations: [...item.locations, location] }
							: item,
					)
				: [...storeCatalog, { productId, locations: [location] }];

			return {
				catalogByStoreId: {
					...state.catalogByStoreId,
					[storeId]: nextCatalog,
				},
			};
		}),
	updateLocation: (storeId, productId, locationId, position) =>
		set((state) => ({
			catalogByStoreId: updateCatalogLocations(
				state.catalogByStoreId,
				storeId,
				(location) => ({ ...location, ...position }),
				productId,
				locationId,
			),
		})),
	removeLocation: (storeId, productId, locationId) =>
		set((state) => ({
			catalogByStoreId: updateCatalogLocations(
				state.catalogByStoreId,
				storeId,
				() => null,
				productId,
				locationId,
			),
		})),
	clearStoreCatalog: (storeId) =>
		set((state) => {
			const catalogByStoreId = { ...state.catalogByStoreId };
			delete catalogByStoreId[storeId];
			return { catalogByStoreId };
		}),
}));
