"use client";

import { Check, PackageSearch } from "lucide-react";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import { paginationPageSize } from "@/constants/pagination";
import { useSearchPagination } from "@/hooks/use-search-pagination";
import { filterProducts } from "@/lib/filter-products";
import type { Product } from "@/types/product";

type CatalogProductPickerModalProps = {
	products: readonly Product[];
	onClose: () => void;
	onSelect: (product: Product) => void;
};

export function CatalogProductPickerModal({
	products,
	onClose,
	onSelect,
}: CatalogProductPickerModalProps) {
	const {
		activePage,
		filteredItems,
		goToNextPage,
		goToPreviousPage,
		query,
		setSearchQuery,
		totalPages,
		visibleItems,
	} = useSearchPagination({
		items: products,
		itemsPerPage: paginationPageSize.products,
		filter: filterProducts,
	});

	return (
		<Modal
			title="Adicionar produto ao catálogo"
			description="Selecione o produto que será localizado nesta loja."
			closeLabel="Fechar seleção de produto"
			onClose={onClose}
			size="lg"
			layout="scrollable"
		>
			<div className="mt-6">
				<SearchInput
					query={query}
					onQueryChange={setSearchQuery}
					placeholder="Buscar por produto, código ou categoria"
					label="Buscar produtos para o catálogo"
				/>
				{filteredItems.length === 0 ? (
					<EmptyState
						icon={PackageSearch}
						title="Nenhum produto encontrado"
						description="Tente buscar por outro produto, código ou categoria."
					/>
				) : (
					<>
						<ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
							{visibleItems.map((product) => (
								<li
									key={product.id}
									className="flex items-center gap-3 p-3 sm:p-4"
								>
									<ProductThumbnail
										source={product.image}
										productName={product.nome}
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate font-bold">{product.nome}</p>
										<p className="mt-1 text-sm text-muted">
											{product.codigo} · {product.categoria.label}
										</p>
									</div>
									<Button size="compact" onClick={() => onSelect(product)}>
										<Check aria-hidden="true" className="size-4" />
										Selecionar
									</Button>
								</li>
							))}
						</ul>
						<PaginationControls
							activePage={activePage}
							totalPages={totalPages}
							onPrevious={goToPreviousPage}
							onNext={goToNextPage}
							label="Paginação de produtos do catálogo"
						/>
					</>
				)}
			</div>
		</Modal>
	);
}
