"use client";

import { useQueries } from "@tanstack/react-query";
import { getProduct } from "@/api/products";
import { queryKeys } from "@/api/query-keys";
import type {
	CatalogProduct,
	StoreCatalogProduct,
} from "@/types/store-catalog";

export function useCatalogProductReferences(
	catalogProducts: readonly StoreCatalogProduct[],
) {
	const referenceQueries = useQueries({
		queries: catalogProducts.map((catalogProduct) => ({
			queryKey: queryKeys.products.byId(catalogProduct.referenceProductId),
			queryFn: () => getProduct(catalogProduct.referenceProductId),
			staleTime: Infinity,
		})),
	});

	return catalogProducts.flatMap<CatalogProduct>((catalogProduct, index) => {
		const referenceProduct = referenceQueries[index]?.data;
		return referenceProduct
			? [
					{
						...referenceProduct,
						referenceProductId: referenceProduct.id,
						id: catalogProduct.id,
						location: catalogProduct.location,
					},
				]
			: [];
	});
}
