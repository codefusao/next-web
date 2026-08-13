"use client";

import { MapPinned } from "lucide-react";
import { useMemo, useState } from "react";
import { CatalogProducts } from "@/components/catalog/catalog-products";
import { InteractiveStoreMap } from "@/components/catalog/map/interactive-store-map";
import type { StoreMapMarker } from "@/components/catalog/map/map-types";
import { CatalogProductControls } from "@/components/catalog/products/catalog-product-controls";
import { EmptyState } from "@/components/ui/empty-state";
import { useCatalogProductBrowser } from "@/hooks/catalog/use-catalog-product-browser";
import type { StoreListItem } from "@/types/store";
import type { CatalogProduct } from "@/types/store-catalog";

type StoreCatalogContentProps = {
	store: StoreListItem;
	products: readonly CatalogProduct[];
	markers: readonly StoreMapMarker[];
	onEditLocation: (product: CatalogProduct) => void;
	onRemoveLocation: (product: CatalogProduct) => void;
};

export function CatalogContent({
	store,
	products,
	markers,
	onEditLocation,
	onRemoveLocation,
}: StoreCatalogContentProps) {
	const [highlightedProductLocationId, setHighlightedProductLocationId] =
		useState<string | null>(null);
	const {
		activePage,
		categoryId,
		filteredProducts,
		goToNextPage,
		goToPreviousPage,
		order,
		query,
		totalPages,
		updateCategory,
		updateOrder,
		updateQuery,
		visibleItems,
	} = useCatalogProductBrowser(products);
	const isEmptyCatalog = products.length === 0;
	const filteredProductLocationIds = useMemo(
		() => new Set(filteredProducts.map((product) => product.id)),
		[filteredProducts],
	);
	const filteredMarkers = useMemo(
		() => markers.filter((marker) => filteredProductLocationIds.has(marker.id)),
		[filteredProductLocationIds, markers],
	);

	function editMarker(markerId: string) {
		const marker = filteredMarkers.find((item) => item.id === markerId);
		if (!marker) return;

		const product = products.find((item) => item.id === marker.id);
		if (product) onEditLocation(product);
	}

	function removeMarker(markerId: string) {
		const marker = filteredMarkers.find((item) => item.id === markerId);
		if (!marker) return;

		const product = products.find((item) => item.id === marker.id);
		if (product) onRemoveLocation(product);
	}

	function editCatalogProduct(product: CatalogProduct) {
		onEditLocation(product);
	}

	function removeCatalogProduct(product: CatalogProduct) {
		onRemoveLocation(product);
	}

	return (
		<div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
			<section className="flex min-h-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
				<CatalogProductControls
					query={query}
					categoryId={categoryId}
					order={order}
					onQueryChange={updateQuery}
					onCategoryChange={updateCategory}
					onOrderChange={updateOrder}
				/>
				<div className="flex flex-1 flex-col p-3 sm:p-4">
					<p className="mb-4 text-sm font-medium text-muted">
						{filteredProducts.length} produto
						{filteredProducts.length === 1 ? "" : "s"} cadastrado
						{filteredProducts.length === 1 ? "" : "s"}
					</p>
					{filteredProducts.length === 0 ? (
						<EmptyState
							icon={MapPinned}
							className="flex flex-1 flex-col justify-center"
							title={
								isEmptyCatalog
									? "Nenhum produto no catálogo"
									: "Nenhum produto encontrado"
							}
							description={
								isEmptyCatalog
									? "Adicione um produto e marque onde ele fica no mapa da loja."
									: "Tente buscar ou filtrar por outra categoria."
							}
						/>
					) : (
						<CatalogProducts
							products={visibleItems}
							highlightedProductLocationId={highlightedProductLocationId}
							activePage={activePage}
							totalPages={totalPages}
							onEditLocation={editCatalogProduct}
							onRemoveLocation={removeCatalogProduct}
							onHighlightedProductLocationChange={
								setHighlightedProductLocationId
							}
							onPreviousPage={goToPreviousPage}
							onNextPage={goToNextPage}
						/>
					)}
				</div>
			</section>
			<section className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-background p-2 sm:p-3">
				<div className="mb-2 flex items-center justify-between gap-3 px-1">
					<div>
						<h2 className="font-bold">Mapa da loja</h2>
						<p className="mt-0.5 text-sm text-muted">
							Passe o cursor sobre um marcador para ver o produto.
						</p>
					</div>
				</div>
				<InteractiveStoreMap
					storeMapUrl={store.storeMapUrl}
					storeName={store.name}
					markers={filteredMarkers}
					highlightedMarkerId={highlightedProductLocationId}
					onMarkerClick={editMarker}
					onMarkerRemove={removeMarker}
					onMarkerHover={setHighlightedProductLocationId}
				/>
			</section>
		</div>
	);
}
