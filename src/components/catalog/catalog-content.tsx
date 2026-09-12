"use client";

import { MapPinned } from "lucide-react";
import { useState } from "react";
import { CatalogProducts } from "@/components/catalog/catalog-products";
import { InteractiveStoreMap } from "@/components/catalog/map/interactive-store-map";
import type { StoreMapMarker } from "@/components/catalog/map/map-types";
import { CatalogProductControls } from "@/components/catalog/products/catalog-product-controls";
import { EmptyState } from "@/components/ui/empty-state";
import type { CompanyListItem } from "@/types/company";
import type { PaginationMeta, ProductOrder } from "@/types/product";
import type { CatalogProduct } from "@/types/store-catalog";
import type { StoreMapReferencePoint } from "@/types/store-map";

type StoreCatalogContentProps = {
	store: CompanyListItem;
	storeMapUrl: string | null;
	referencePoints: readonly StoreMapReferencePoint[] | null;
	products: readonly CatalogProduct[];
	markers: readonly StoreMapMarker[];
	onShowLocations: (products: CatalogProduct[]) => void;
	onEditLocation: (product: CatalogProduct) => void;
	onRemoveLocation: (product: CatalogProduct) => void;
	query: string;
	onQueryChange: (query: string) => void;
	categoryId: string;
	order: ProductOrder;
	meta?: PaginationMeta;
	onCategoryChange: (categoryId: string) => void;
	onOrderChange: (order: ProductOrder) => void;
	onPreviousPage: () => void;
	onNextPage: () => void;
};

export function CatalogContent({
	store,
	storeMapUrl,
	referencePoints,
	products,
	markers,
	onShowLocations,
	onEditLocation,
	onRemoveLocation,
	query,
	onQueryChange,
	categoryId,
	order,
	meta,
	onCategoryChange,
	onOrderChange,
	onPreviousPage,
	onNextPage,
}: StoreCatalogContentProps) {
	const [highlightedProductLocationId, setHighlightedProductLocationId] =
		useState<string | null>(null);
	const [hoveredReferenceProductId, setHoveredReferenceProductId] = useState<
		string | null
	>(null);
	const isEmptyCatalog = (meta?.totalRecords ?? 0) === 0;
	const highlightedMarkerIds = hoveredReferenceProductId
		? products
				.filter(
					(product) => product.referenceProductId === hoveredReferenceProductId,
				)
				.map((product) => product.id)
		: [];

	function editMarker(markerId: string) {
		const marker = markers.find((item) => item.id === markerId);
		if (!marker) return;

		const product = products.find((item) => item.id === marker.id);
		if (product) onEditLocation(product);
	}

	function removeMarker(markerId: string) {
		const marker = markers.find((item) => item.id === markerId);
		if (!marker) return;

		const product = products.find((item) => item.id === marker.id);
		if (product) onRemoveLocation(product);
	}

	function showProductLocations(productLocations: CatalogProduct[]) {
		setHoveredReferenceProductId(null);
		onShowLocations(productLocations);
	}

	return (
		<div className="mt-4 grid items-start gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)]">
			<section className="flex min-h-0 flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
				<CatalogProductControls
					query={query}
					categoryId={categoryId}
					order={order}
					onQueryChange={onQueryChange}
					onCategoryChange={onCategoryChange}
					onOrderChange={onOrderChange}
				/>
				<div className="flex flex-1 flex-col p-3 sm:p-4">
					<p className="mb-4 text-sm font-medium text-muted">
						{meta?.totalRecords ?? 0} produto
						{(meta?.totalRecords ?? 0) === 1 ? "" : "s"} cadastrado
						{(meta?.totalRecords ?? 0) === 1 ? "" : "s"}
					</p>
					{products.length === 0 ? (
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
							products={products}
							highlightedProductLocationId={highlightedProductLocationId}
							activePage={meta?.currentPage ?? 1}
							totalPages={meta?.totalPages ?? 1}
							onShowLocations={showProductLocations}
							onProductHover={setHoveredReferenceProductId}
							onPreviousPage={onPreviousPage}
							onNextPage={onNextPage}
						/>
					)}
				</div>
			</section>
			<section className="self-start overflow-hidden rounded-[var(--radius-card)] border border-border bg-background p-2 sm:p-3">
				<div className="mb-2 flex items-center justify-between gap-3 px-1">
					<div>
						<h2 className="font-bold">Mapa da loja</h2>
						<p className="mt-0.5 text-sm text-muted">
							Passe o cursor sobre um marcador para ver o produto.
						</p>
					</div>
				</div>
				<InteractiveStoreMap
					storeMapUrl={storeMapUrl}
					storeName={store.name}
					referencePoints={referencePoints ?? []}
					markers={markers}
					highlightedMarkerIds={highlightedMarkerIds}
					onMarkerClick={editMarker}
					onMarkerRemove={removeMarker}
					onMarkerHover={setHighlightedProductLocationId}
				/>
			</section>
		</div>
	);
}
