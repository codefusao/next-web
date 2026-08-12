"use client";

import { CatalogProductCard } from "@/components/stores/catalog-product-card";
import { PaginationControls } from "@/components/ui/pagination-controls";
import type { CatalogProductEntry } from "@/types/store-catalog";

export type { CatalogProductEntry } from "@/types/store-catalog";

type StoreCatalogProductsProps = {
	products: readonly CatalogProductEntry[];
	highlightedLocationId: string | null;
	activePage: number;
	totalPages: number;
	onEditLocation: (product: CatalogProductEntry) => void;
	onRemoveLocation: (product: CatalogProductEntry) => void;
	onHoverChange: (locationId: string | null) => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
};

export function StoreCatalogProducts({
	products,
	highlightedLocationId,
	activePage,
	totalPages,
	onEditLocation,
	onRemoveLocation,
	onHoverChange,
	onPreviousPage,
	onNextPage,
}: StoreCatalogProductsProps) {
	return (
		<div className="flex flex-1 flex-col">
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
				{products.map((product) => (
					<CatalogProductCard
						key={product.location.id}
						product={product}
						isHighlighted={highlightedLocationId === product.location.id}
						onEditLocation={onEditLocation}
						onRemoveLocation={onRemoveLocation}
						onHoverChange={onHoverChange}
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
