"use client";

import { MapPinned } from "lucide-react";
import { useMemo, useState } from "react";
import { CatalogProductControls } from "@/components/stores/catalog-product-controls";
import {
	InteractiveStoreMap,
	type StoreMapMarker,
} from "@/components/stores/interactive-store-map";
import { StoreCatalogProducts } from "@/components/stores/store-catalog-products";
import { EmptyState } from "@/components/ui/empty-state";
import { useCatalogProductBrowser } from "@/hooks/use-catalog-product-browser";
import type { StoreListItem } from "@/types/store";
import type {
	CatalogProduct,
	CatalogProductEntry,
	StoreCatalogLocation,
} from "@/types/store-catalog";

type StoreCatalogContentProps = {
	store: StoreListItem;
	products: readonly CatalogProduct[];
	markers: readonly StoreMapMarker[];
	onEditLocation: (
		product: CatalogProduct,
		location: StoreCatalogLocation,
	) => void;
	onRemoveLocation: (
		product: CatalogProduct,
		location: StoreCatalogLocation,
	) => void;
};

export function StoreCatalogContent({
	store,
	products,
	markers,
	onEditLocation,
	onRemoveLocation,
}: StoreCatalogContentProps) {
	const [highlightedLocationId, setHighlightedLocationId] = useState<
		string | null
	>(null);
	const catalogEntries = useMemo<CatalogProductEntry[]>(
		() =>
			products.flatMap((product) =>
				product.locations.map((location) => ({ ...product, location })),
			),
		[products],
	);
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
	} = useCatalogProductBrowser(catalogEntries);
	const isEmptyCatalog = products.length === 0;
	const filteredMarkerIds = useMemo(
		() => new Set(filteredProducts.map((product) => product.location.id)),
		[filteredProducts],
	);
	const filteredMarkers = useMemo(
		() => markers.filter((marker) => filteredMarkerIds.has(marker.id)),
		[filteredMarkerIds, markers],
	);

	function editMarker(markerId: string) {
		const marker = filteredMarkers.find((item) => item.id === markerId);
		if (!marker) return;

		const product = products.find((item) => item.id === marker.productId);
		const location = product?.locations.find((item) => item.id === marker.id);
		if (product && location) onEditLocation(product, location);
	}

	function removeMarker(markerId: string) {
		const marker = filteredMarkers.find((item) => item.id === markerId);
		if (!marker) return;

		const product = products.find((item) => item.id === marker.productId);
		const location = product?.locations.find((item) => item.id === marker.id);
		if (product && location) onRemoveLocation(product, location);
	}

	function editCatalogEntry(entry: CatalogProductEntry) {
		const product = products.find((item) => item.id === entry.id);
		if (product) onEditLocation(product, entry.location);
	}

	function removeCatalogEntry(entry: CatalogProductEntry) {
		const product = products.find((item) => item.id === entry.id);
		if (product) onRemoveLocation(product, entry.location);
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
						<StoreCatalogProducts
							products={visibleItems}
							highlightedLocationId={highlightedLocationId}
							activePage={activePage}
							totalPages={totalPages}
							onEditLocation={editCatalogEntry}
							onRemoveLocation={removeCatalogEntry}
							onHoverChange={setHighlightedLocationId}
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
					highlightedMarkerId={highlightedLocationId}
					onMarkerClick={editMarker}
					onMarkerRemove={removeMarker}
					onMarkerHover={setHighlightedLocationId}
				/>
			</section>
		</div>
	);
}
