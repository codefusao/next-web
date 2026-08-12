"use client";

import { useMemo, useReducer } from "react";
import { toast } from "sonner";
import { CatalogContent } from "@/components/catalog/catalog-content";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import type { StoreMapMarker } from "@/components/catalog/map/interactive-store-map";
import { CatalogLocationMapModal } from "@/components/catalog/modals/location-map-modal";
import { CatalogProductPickerModal } from "@/components/catalog/modals/product-picker-modal";
import { RemoveCatalogLocationDialog } from "@/components/catalog/modals/remove-location-dialog";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { useProductsQuery } from "@/hooks/use-products-query";
import {
	useCreateStoreCatalogProductMutation,
	useRemoveStoreCatalogProductMutation,
	useStoreCatalogQuery,
	useUpdateStoreCatalogProductMutation,
} from "@/hooks/use-store-catalog-query";
import { useStoresQuery } from "@/hooks/use-stores-query";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import type { Product } from "@/types/product";
import type { CatalogProduct } from "@/types/store-catalog";

type StoreCatalogProps = {
	storeId: string;
};

enum CatalogProductDialogType {
	Closed = "closed",
	Picker = "picker",
	Locating = "locating",
	Editing = "editing",
	Removing = "removing",
}

enum CatalogProductDialogActionType {
	OpenPicker = "open-picker",
	SelectProduct = "select-product",
	EditProduct = "edit-product",
	RemoveProduct = "remove-product",
	Idle = "idle",
}

type CatalogProductDialogState =
	| { type: CatalogProductDialogType.Closed }
	| { type: CatalogProductDialogType.Picker }
	| { type: CatalogProductDialogType.Locating; product: Product }
	| { type: CatalogProductDialogType.Editing; product: CatalogProduct }
	| { type: CatalogProductDialogType.Removing; product: CatalogProduct };

type CatalogProductDialogAction =
	| { type: CatalogProductDialogActionType.OpenPicker }
	| { type: CatalogProductDialogActionType.SelectProduct; product: Product }
	| {
			type: CatalogProductDialogActionType.EditProduct;
			product: CatalogProduct;
	  }
	| {
			type: CatalogProductDialogActionType.RemoveProduct;
			product: CatalogProduct;
	  }
	| { type: CatalogProductDialogActionType.Idle };

function catalogProductDialogReducer(
	_state: CatalogProductDialogState,
	action: CatalogProductDialogAction,
): CatalogProductDialogState {
	switch (action.type) {
		case CatalogProductDialogActionType.OpenPicker:
			return { type: CatalogProductDialogType.Picker };
		case CatalogProductDialogActionType.SelectProduct:
			return {
				type: CatalogProductDialogType.Locating,
				product: action.product,
			};
		case CatalogProductDialogActionType.EditProduct:
			return {
				type: CatalogProductDialogType.Editing,
				product: action.product,
			};
		case CatalogProductDialogActionType.RemoveProduct:
			return {
				type: CatalogProductDialogType.Removing,
				product: action.product,
			};
		case CatalogProductDialogActionType.Idle:
			return { type: CatalogProductDialogType.Closed };
	}
}

export function Catalog({ storeId }: StoreCatalogProps) {
	const { data: stores = [] } = useStoresQuery();
	const { data: catalogItems = [] } = useStoreCatalogQuery(storeId);
	const createCatalogProduct = useCreateStoreCatalogProductMutation();
	const updateCatalogProduct = useUpdateStoreCatalogProductMutation();
	const removeCatalogProduct = useRemoveStoreCatalogProductMutation();
	const store = stores.find((store) => store.id === storeId);
	const [catalogProductDialog, catalogProductDialogDispatch] = useReducer(
		catalogProductDialogReducer,
		{
			type: CatalogProductDialogType.Closed,
		},
	);
	const { data: products = [] } = useProductsQuery(
		catalogProductDialog.type === CatalogProductDialogType.Picker,
	);
	const productReferencesById = useMemo<Record<string, Product>>(
		() => Object.fromEntries(products.map((product) => [product.id, product])),
		[products],
	);
	const catalogProducts = useMemo<CatalogProduct[]>(
		() =>
			catalogItems.map((catalogItem) => ({
				...productReferencesById[catalogItem.referenceProductId],
				id: catalogItem.id,
				referenceProductId: catalogItem.referenceProductId,
				location: catalogItem.location,
			})),
		[catalogItems, productReferencesById],
	);
	const markers = useMemo<StoreMapMarker[]>(
		() =>
			catalogProducts.map((product) => ({
				...product.location,
				id: product.id,
				label: product.nome,
				referenceProductId: product.referenceProductId,
				productName: product.nome,
				productCategory: product.categoria.label,
				productImage: product.image,
				locationLabel: product.location.description,
			})),
		[catalogProducts],
	);

	if (!store) {
		return (
			<StoreNotFoundState className="mx-auto w-full max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8" />
		);
	}

	async function saveNewLocation(position: StoreCatalogLocationFields) {
		if (catalogProductDialog.type !== CatalogProductDialogType.Locating) return;

		try {
			await createCatalogProduct.mutateAsync({
				storeId,
				referenceProductId: catalogProductDialog.product.id,
				location: position,
			});
			catalogProductDialogDispatch({
				type: CatalogProductDialogActionType.Idle,
			});
			toast.success("Produto localizado no catálogo da loja.");
		} catch {
			toast.error("Não foi possível adicionar a localização.");
		}
	}

	async function saveCatalogProductLocation(
		position: StoreCatalogLocationFields,
	) {
		if (catalogProductDialog.type !== CatalogProductDialogType.Editing) return;

		try {
			await updateCatalogProduct.mutateAsync({
				storeId,
				catalogProductId: catalogProductDialog.product.id,
				location: position,
			});
			catalogProductDialogDispatch({
				type: CatalogProductDialogActionType.Idle,
			});
			toast.success("Localização atualizada com sucesso.");
		} catch {
			toast.error("Não foi possível atualizar a localização.");
		}
	}

	async function confirmCatalogProductRemoval() {
		if (catalogProductDialog.type !== CatalogProductDialogType.Removing) return;

		try {
			await removeCatalogProduct.mutateAsync({
				storeId,
				catalogProductId: catalogProductDialog.product.id,
			});
			catalogProductDialogDispatch({
				type: CatalogProductDialogActionType.Idle,
			});
			toast.success("Produto removido do catálogo.");
		} catch {
			toast.error("Não foi possível remover a localização.");
		}
	}

	return (
		<section className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-center px-2 py-3 sm:px-3 sm:py-4 lg:px-4">
			<CatalogHeader
				store={store}
				onAddProduct={() =>
					catalogProductDialogDispatch({
						type: CatalogProductDialogActionType.OpenPicker,
					})
				}
			/>
			<CatalogContent
				store={store}
				products={catalogProducts}
				markers={markers}
				onEditLocation={(product) =>
					catalogProductDialogDispatch({
						type: CatalogProductDialogActionType.EditProduct,
						product,
					})
				}
				onRemoveLocation={(product) =>
					catalogProductDialogDispatch({
						type: CatalogProductDialogActionType.RemoveProduct,
						product,
					})
				}
			/>
			{catalogProductDialog.type === CatalogProductDialogType.Picker ? (
				<CatalogProductPickerModal
					products={products}
					onClose={() =>
						catalogProductDialogDispatch({
							type: CatalogProductDialogActionType.Idle,
						})
					}
					onSelect={(product) =>
						catalogProductDialogDispatch({
							type: CatalogProductDialogActionType.SelectProduct,
							product,
						})
					}
				/>
			) : null}
			{catalogProductDialog.type === CatalogProductDialogType.Locating ? (
				<CatalogLocationMapModal
					store={store}
					product={catalogProductDialog.product}
					onClose={() =>
						catalogProductDialogDispatch({
							type: CatalogProductDialogActionType.Idle,
						})
					}
					onSave={saveNewLocation}
				/>
			) : null}
			{catalogProductDialog.type === CatalogProductDialogType.Editing ? (
				<CatalogLocationMapModal
					store={store}
					product={catalogProductDialog.product}
					initialPosition={catalogProductDialog.product.location}
					onClose={() =>
						catalogProductDialogDispatch({
							type: CatalogProductDialogActionType.Idle,
						})
					}
					onSave={saveCatalogProductLocation}
				/>
			) : null}
			{catalogProductDialog.type === CatalogProductDialogType.Removing ? (
				<RemoveCatalogLocationDialog
					productName={catalogProductDialog.product.nome}
					onCancel={() =>
						catalogProductDialogDispatch({
							type: CatalogProductDialogActionType.Idle,
						})
					}
					onConfirm={confirmCatalogProductRemoval}
				/>
			) : null}
		</section>
	);
}
