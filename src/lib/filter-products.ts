import { normalizeSearchText } from "@/lib/normalize-search-text";
import type { Product } from "@/types/product";

type SearchableProduct = Pick<Product, "codigo" | "nome" | "categoria">;

export function filterProducts<T extends SearchableProduct>(
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
