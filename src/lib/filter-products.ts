import { normalizeSearchText } from "@/lib/normalize-search-text";
import type { ProductPlaceholder } from "@/store/product-store";

export function filterProducts(
	products: readonly ProductPlaceholder[],
	query: string,
) {
	const normalizedQuery = normalizeSearchText(query.trim());
	if (!normalizedQuery) return products;

	return products.filter((product) =>
		[product.codigo, product.nome, product.categoria.label].some((value) =>
			normalizeSearchText(value).includes(normalizedQuery),
		),
	);
}
