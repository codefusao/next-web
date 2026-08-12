import { normalizeSearchText } from "@/lib/normalize-search-text";
import type { Product } from "@/types/product";

export function filterProducts<T extends Product>(
	products: readonly T[],
	query: string,
): readonly T[] {
	const normalizedQuery = normalizeSearchText(query.trim());
	if (!normalizedQuery) return products;

	return products.filter((product) =>
		[product.codigo, product.nome, product.categoria.label].some((value) =>
			normalizeSearchText(value).includes(normalizedQuery),
		),
	);
}
