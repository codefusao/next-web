import { normalizeSearchText } from "@/lib/normalize-search-text";
import type { StoreListItem } from "@/types/store";

export function filterStores(stores: readonly StoreListItem[], query: string) {
	const normalizedQuery = normalizeSearchText(query.trim());
	if (!normalizedQuery) return stores;

	return stores.filter((store) =>
		[store.name, store.address ?? ""].some((value) =>
			normalizeSearchText(value).includes(normalizedQuery),
		),
	);
}
