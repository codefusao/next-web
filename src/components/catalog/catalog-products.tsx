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
	onShowLocations: (products: CatalogProduct[]) => void;
	onProductHover: (referenceProductId: string | null) => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
};

export function CatalogProducts({
	products,
	highlightedProductLocationId,
	activePage,
	totalPages,
	onShowLocations,
	onProductHover,
	onPreviousPage,
	onNextPage,
}: StoreCatalogProductsProps) {
	const productGroups = Array.from(
		products.reduce((groups, product) => {
			const locations = groups.get(product.referenceProductId) ?? [];
			locations.push(product);
			groups.set(product.referenceProductId, locations);
			return groups;
		}, new Map<string, CatalogProduct[]>()),
	);

	return (
		<div className="flex flex-1 flex-col">
			<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
				{productGroups.map(([productId, locations]) => (
					<CatalogProductCard
						key={productId}
						product={locations[0]}
						locationsCount={locations.length}
						isHighlighted={locations.some(
							(location) => location.id === highlightedProductLocationId,
						)}
						onShowLocations={() => onShowLocations(locations)}
						onProductHover={onProductHover}
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
