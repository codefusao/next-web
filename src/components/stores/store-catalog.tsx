"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CatalogLocationMapModal } from "@/components/stores/catalog-location-map-modal";
import { CatalogProductPickerModal } from "@/components/stores/catalog-product-picker-modal";
import type { StoreMapMarker } from "@/components/stores/interactive-store-map";
import { RemoveCatalogLocationDialog } from "@/components/stores/remove-catalog-location-dialog";
import { StoreCatalogContent } from "@/components/stores/store-catalog-content";
import { StoreCatalogHeader } from "@/components/stores/store-catalog-header";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import { useProductStore } from "@/store/product-store";
import {
	emptyStoreCatalogItems,
	useStoreCatalogStore,
} from "@/store/store-catalog-store";
import { useStoresStore } from "@/store/stores-store";
import type { Product } from "@/types/product";
import type {
	CatalogProduct,
	StoreCatalogLocation,
} from "@/types/store-catalog";

type StoreCatalogProps = {
	storeId: string;
};

type LocationSelection = {
	product: CatalogProduct;
	location: StoreCatalogLocation;
};

export function StoreCatalog({ storeId }: StoreCatalogProps) {
	const store = useStoresStore((state) =>
		state.stores.find((item) => item.id === storeId),
	);
	const products = useProductStore((state) => state.products);
	const catalogItems = useStoreCatalogStore(
		(state) => state.catalogByStoreId[storeId] ?? emptyStoreCatalogItems,
	);
	const addLocation = useStoreCatalogStore((state) => state.addLocation);
	const updateLocation = useStoreCatalogStore((state) => state.updateLocation);
	const removeLocation = useStoreCatalogStore((state) => state.removeLocation);
	const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
	const [productToLocate, setProductToLocate] = useState<Product | null>(null);
	const [locationToEdit, setLocationToEdit] =
		useState<LocationSelection | null>(null);
	const [locationToRemove, setLocationToRemove] =
		useState<LocationSelection | null>(null);

	const catalogProducts = useMemo<CatalogProduct[]>(
		() =>
			catalogItems.flatMap((catalogItem) => {
				const product = products.find(
					(item) => item.id === catalogItem.productId,
				);
				return product
					? [{ ...product, locations: catalogItem.locations }]
					: [];
			}),
		[catalogItems, products],
	);
	const markers = useMemo<StoreMapMarker[]>(
		() =>
			catalogProducts.flatMap((product) =>
				product.locations.map((location, index) => ({
					...location,
					label: `${product.nome}, localização ${index + 1}`,
					productId: product.id,
					productName: product.nome,
					productCategory: product.categoria.label,
					productImage: product.imagem_thumb ?? product.imagem,
					locationLabel: location.description,
				})),
			),
		[catalogProducts],
	);

	if (!store) {
		return (
			<StoreNotFoundState className="mx-auto w-full max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8" />
		);
	}

	function selectProduct(product: Product) {
		setIsProductPickerOpen(false);
		setProductToLocate(product);
	}

	function saveNewLocation(position: StoreCatalogLocationFields) {
		if (!productToLocate) return;

		addLocation(storeId, productToLocate.id, position);
		setProductToLocate(null);
		toast.success("Produto localizado no catálogo da loja.");
	}

	function saveLocationEdit(position: StoreCatalogLocationFields) {
		if (!locationToEdit) return;

		updateLocation(
			storeId,
			locationToEdit.product.id,
			locationToEdit.location.id,
			position,
		);
		setLocationToEdit(null);
		toast.success("Localização atualizada com sucesso.");
	}

	function confirmLocationRemoval() {
		if (!locationToRemove) return;

		removeLocation(
			storeId,
			locationToRemove.product.id,
			locationToRemove.location.id,
		);
		setLocationToRemove(null);
		toast.success("Localização removida do catálogo.");
	}

	return (
		<section className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-center px-2 py-3 sm:px-3 sm:py-4 lg:px-4">
			<StoreCatalogHeader
				store={store}
				onAddProduct={() => setIsProductPickerOpen(true)}
			/>
			<StoreCatalogContent
				store={store}
				products={catalogProducts}
				markers={markers}
				onEditLocation={(product, location) =>
					setLocationToEdit({ product, location })
				}
				onRemoveLocation={(product, location) =>
					setLocationToRemove({ product, location })
				}
			/>
			{isProductPickerOpen ? (
				<CatalogProductPickerModal
					products={products}
					onClose={() => setIsProductPickerOpen(false)}
					onSelect={selectProduct}
				/>
			) : null}
			{productToLocate ? (
				<CatalogLocationMapModal
					store={store}
					product={productToLocate}
					onClose={() => setProductToLocate(null)}
					onSave={saveNewLocation}
				/>
			) : null}
			{locationToEdit ? (
				<CatalogLocationMapModal
					store={store}
					product={locationToEdit.product}
					initialPosition={locationToEdit.location}
					onClose={() => setLocationToEdit(null)}
					onSave={saveLocationEdit}
				/>
			) : null}
			{locationToRemove ? (
				<RemoveCatalogLocationDialog
					productName={locationToRemove.product.nome}
					onCancel={() => setLocationToRemove(null)}
					onConfirm={confirmLocationRemoval}
				/>
			) : null}
		</section>
	);
}
