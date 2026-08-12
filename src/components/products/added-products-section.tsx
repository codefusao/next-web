"use client";

import { Boxes } from "lucide-react";
import { AddProductModal } from "@/components/products/add-product-modal";
import { ProductTable } from "@/components/products/product-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { paginationPageSize } from "@/constants/pagination";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { filterProducts } from "@/lib/filter-products";
import { useProductStore } from "@/store/product-store";

export function AddedProductsSection() {
	const products = useProductStore((state) => state.products);
	const {
		activePage,
		goToNextPage,
		goToPreviousPage,
		filteredItems,
		query,
		setSearchQuery,
		totalPages,
		visibleItems: visibleProducts,
	} = useSearchPagination({
		items: products,
		itemsPerPage: paginationPageSize.products,
		filter: filterProducts,
	});

	return (
		<section aria-label="Lista de produtos">
			<div className="mb-4 flex items-start gap-3">
				<SearchInput
					query={query}
					onQueryChange={setSearchQuery}
					placeholder="Buscar por produto, código ou categoria"
					label="Buscar produtos"
					className="mb-0 flex-1"
				/>
				<AddProductModal />
			</div>
			{filteredItems.length === 0 ? (
				<EmptyState
					icon={Boxes}
					title="Nenhum produto encontrado"
					description="Tente buscar por outro produto, código ou categoria."
				/>
			) : (
				<>
					<ProductTable variant="catalog" products={visibleProducts} />
					<PaginationControls
						activePage={activePage}
						totalPages={totalPages}
						onPrevious={goToPreviousPage}
						onNext={goToNextPage}
						label="Paginação de produtos"
					/>
				</>
			)}
		</section>
	);
}
