"use client";

import { CatalogProductCard } from "@/components/catalog/products/catalog-product-card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { CatalogProduct } from "@/types/store-catalog";

export type { CatalogProduct } from "@/types/store-catalog";

type StoreCatalogProductsProps = {
	products: readonly CatalogProduct[];
	highlightedProductLocationId: string | null;
	activePage: number;
	totalPages: number;
	onEditLocation: (product: CatalogProduct) => void;
	onRemoveLocation: (product: CatalogProduct) => void;
	onHighlightedProductLocationChange: (catalogProductId: string | null) => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
};

export function CatalogProducts({
	products,
	highlightedProductLocationId,
	activePage,
	totalPages,
	onEditLocation,
	onRemoveLocation,
	onHighlightedProductLocationChange,
	onPreviousPage,
	onNextPage,
}: StoreCatalogProductsProps) {
	return (
		<div className="flex flex-1 flex-col">
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
				{products.map((product) => (
					<CatalogProductCard
						key={product.id}
						product={product}
						isHighlighted={highlightedProductLocationId === product.id}
						onEditLocation={onEditLocation}
						onRemoveLocation={onRemoveLocation}
						onHighlightedProductLocationChange={
							onHighlightedProductLocationChange
						}
					/>
				))}
			</div>
			<div className="mt-auto">
				<PaginationControls
					activePage={activePage}
					totalPages={totalPages}
					onPrevious={onPreviousPage}
					onNext={onNextPage}
					label="Paginação dos produtos do catálogo"
				/>
			</div>
		</div>
	);
}
