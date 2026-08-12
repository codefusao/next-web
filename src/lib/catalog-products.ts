import type { Product } from "@/types/product";

export const catalogProductOrder = {
	name: "name",
	category: "category",
	code: "code",
} as const;

export type CatalogProductOrder =
	(typeof catalogProductOrder)[keyof typeof catalogProductOrder];

export function filterCatalogProducts<T extends Product>(
	products: readonly T[],
	categoryId: string,
): readonly T[] {
	if (!categoryId) return products;

	return products.filter((product) => product.categoria.id === categoryId);
}

export function sortCatalogProducts<T extends Product>(
	products: readonly T[],
	order: CatalogProductOrder,
): readonly T[] {
	return [...products].sort((firstProduct, secondProduct) => {
		if (order === catalogProductOrder.category) {
			return firstProduct.categoria.label.localeCompare(
				secondProduct.categoria.label,
				"pt-BR",
			);
		}

		const firstValue =
			order === catalogProductOrder.code
				? firstProduct.codigo
				: firstProduct.nome;
		const secondValue =
			order === catalogProductOrder.code
				? secondProduct.codigo
				: secondProduct.nome;

		return firstValue.localeCompare(secondValue, "pt-BR", {
			numeric: true,
		});
	});
}
