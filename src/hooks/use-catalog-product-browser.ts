import { useMemo, useState } from "react";
import { paginationPageSize } from "@/constants/pagination";
import { usePagination } from "@/hooks/use-pagination";
import {
	type CatalogProductOrder,
	catalogProductOrder,
	filterCatalogProducts,
	sortCatalogProducts,
} from "@/lib/catalog-products";
import { filterProducts } from "@/lib/filter-products";
import type { Product } from "@/types/product";

export function useCatalogProductBrowser<T extends Product>(
	products: readonly T[],
) {
	const [query, setQuery] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [order, setOrder] = useState<CatalogProductOrder>(
		catalogProductOrder.name,
	);
	const filteredProducts = useMemo(() => {
		const searchedProducts = filterProducts(products, query);
		const categorizedProducts = filterCatalogProducts(
			searchedProducts,
			categoryId,
		);

		return sortCatalogProducts(categorizedProducts, order);
	}, [categoryId, order, products, query]);
	const pagination = usePagination(
		filteredProducts,
		paginationPageSize.catalog,
	);

	function updateQuery(nextQuery: string) {
		setQuery(nextQuery);
		pagination.resetPage();
	}

	function updateCategory(nextCategoryId: string) {
		setCategoryId(nextCategoryId);
		pagination.resetPage();
	}

	function updateOrder(nextOrder: CatalogProductOrder) {
		setOrder(nextOrder);
		pagination.resetPage();
	}

	return {
		...pagination,
		categoryId,
		filteredProducts,
		order,
		query,
		updateCategory,
		updateOrder,
		updateQuery,
	};
}
