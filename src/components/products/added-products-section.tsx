"use client";

import { Boxes } from "lucide-react";
import { useState } from "react";
import { AddProductModal } from "@/components/products/add-product-modal";
import { CatalogProductControls } from "@/components/catalog/products/catalog-product-controls";
import { ProductTable } from "@/components/products/product-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useProductsQuery } from "@/hooks/use-products-query";
import { productOrder, type ProductOrder } from "@/types/product";

export function AddedProductsSection() {
	const [query, setQuery] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [order, setOrder] = useState<ProductOrder>(productOrder.name);
	const [page, setPage] = useState(1);
	const { data } = useProductsQuery({ query, categoryId, order, page });
	const products = data?.products ?? [];
	const meta = data?.meta;

	function updateSearch(nextQuery: string) {
		setQuery(nextQuery);
		setPage(1);
	}

	function updateCategory(nextCategoryId: string) {
		setCategoryId(nextCategoryId);
		setPage(1);
	}

	function updateOrder(nextOrder: ProductOrder) {
		setOrder(nextOrder);
		setPage(1);
	}

	return (
		<section aria-label="Lista de produtos">
			<CatalogProductControls
				query={query}
				categoryId={categoryId}
				order={order}
				onQueryChange={updateSearch}
				onCategoryChange={updateCategory}
				onOrderChange={updateOrder}
				searchLabel="Buscar produtos"
				searchPlaceholder="Buscar por produto"
				action={<AddProductModal />}
			/>
			{products.length === 0 ? (
				<EmptyState
					icon={Boxes}
					title="Nenhum produto encontrado"
					description="Tente buscar por outro produto, código ou categoria."
				/>
			) : (
				<>
					<ProductTable variant="catalog" products={products} />
					<PaginationControls
						activePage={meta?.currentPage ?? 1}
						totalPages={meta?.totalPages ?? 1}
						onPrevious={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
						onNext={() =>
							setPage((currentPage) =>
								Math.min(meta?.totalPages ?? 1, currentPage + 1),
							)
						}
						label="Paginação de produtos"
					/>
				</>
			)}
		</section>
	);
}
