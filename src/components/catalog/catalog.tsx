"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CatalogContent } from "@/components/catalog/catalog-content";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import type { StoreMapMarker } from "@/components/catalog/map/map-types";
import { CatalogLocationMapModal } from "@/components/catalog/modals/location-map-modal";
import { CatalogProductPickerModal } from "@/components/catalog/modals/product-picker-modal";
import { RemoveCatalogLocationDialog } from "@/components/catalog/modals/remove-location-dialog";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { useCatalogProductReferences } from "@/hooks/catalog/use-catalog-product-references";
import {
	useCreateStoreCatalogProductMutation,
	useRemoveStoreCatalogProductMutation,
	useStoreCatalogQuery,
	useUpdateStoreCatalogProductMutation,
} from "@/hooks/catalog/use-store-catalog-query";
import { useProductsQuery } from "@/hooks/use-products-query";
import { useStoresQuery } from "@/hooks/use-stores-query";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import type { Product } from "@/types/product";
import type { CatalogProduct } from "@/types/store-catalog";

type StoreCatalogProps = {
	storeId: string;
};

enum CatalogProductDialogType {
	Closed = "closed",
	ProductPicker = "product-picker",
	Locating = "locating",
	Editing = "editing",
	Removing = "removing",
}

type CatalogProductDialogState =
	| { type: CatalogProductDialogType.Closed }
	| { type: CatalogProductDialogType.ProductPicker }
	| { type: CatalogProductDialogType.Locating; product: Product }
	| { type: CatalogProductDialogType.Editing; product: CatalogProduct }
	| { type: CatalogProductDialogType.Removing; product: CatalogProduct };

export function Catalog({ storeId }: StoreCatalogProps) {
	const { data: stores = [] } = useStoresQuery();
	const { data: catalogItems = [] } = useStoreCatalogQuery(storeId);
	const createCatalogProduct = useCreateStoreCatalogProductMutation();
	const updateCatalogProduct = useUpdateStoreCatalogProductMutation();
	const removeCatalogProduct = useRemoveStoreCatalogProductMutation();
	const store = stores.find((store) => store.id === storeId);
	const [dialog, setDialog] = useState<CatalogProductDialogState>({
		type: CatalogProductDialogType.Closed,
	});
	const { data: products = [] } = useProductsQuery(
		dialog.type === CatalogProductDialogType.ProductPicker,
	);
	const catalogProducts = useCatalogProductReferences(catalogItems);
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

	function closeDialog() {
		setDialog({ type: CatalogProductDialogType.Closed });
	}

	async function saveNewLocation(position: StoreCatalogLocationFields) {
		if (dialog.type !== CatalogProductDialogType.Locating) return;

		try {
			await createCatalogProduct.mutateAsync({
				storeId,
				referenceProductId: dialog.product.id,
				location: position,
			});
			closeDialog();
			toast.success("Produto localizado no catálogo da loja.");
		} catch {
			toast.error("Não foi possível adicionar a localização.");
		}
	}

	async function saveCatalogProductLocation(
		position: StoreCatalogLocationFields,
	) {
		if (dialog.type !== CatalogProductDialogType.Editing) return;

		try {
			await updateCatalogProduct.mutateAsync({
				storeId,
				catalogProductId: dialog.product.id,
				location: position,
			});
			closeDialog();
			toast.success("Localização atualizada com sucesso.");
		} catch {
			toast.error("Não foi possível atualizar a localização.");
		}
	}

	async function confirmCatalogProductRemoval() {
		if (dialog.type !== CatalogProductDialogType.Removing) return;

		try {
			await removeCatalogProduct.mutateAsync({
				storeId,
				catalogProductId: dialog.product.id,
			});
			closeDialog();
			toast.success("Produto removido do catálogo.");
		} catch {
			toast.error("Não foi possível remover a localização.");
		}
	}

	if (!store) {
		return (
			<StoreNotFoundState className="mx-auto w-full max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8" />
		);
	}

	return (
		<section className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-center px-2 py-3 sm:px-3 sm:py-4 lg:px-4">
			<CatalogHeader
				store={store}
				onAddProduct={() =>
					setDialog({ type: CatalogProductDialogType.ProductPicker })
				}
			/>
			<CatalogContent
				store={store}
				products={catalogProducts}
				markers={markers}
				onEditLocation={(product) =>
					setDialog({ type: CatalogProductDialogType.Editing, product })
				}
				onRemoveLocation={(product) =>
					setDialog({ type: CatalogProductDialogType.Removing, product })
				}
			/>
			{dialog.type === CatalogProductDialogType.ProductPicker ? (
				<CatalogProductPickerModal
					products={products}
					onClose={closeDialog}
					onSelect={(product) =>
						setDialog({ type: CatalogProductDialogType.Locating, product })
					}
				/>
			) : null}
			{dialog.type === CatalogProductDialogType.Locating ? (
				<CatalogLocationMapModal
					store={store}
					product={dialog.product}
					onClose={closeDialog}
					onSave={saveNewLocation}
				/>
			) : null}
			{dialog.type === CatalogProductDialogType.Editing ? (
				<CatalogLocationMapModal
					store={store}
					product={dialog.product}
					initialPosition={dialog.product.location}
					onClose={closeDialog}
					onSave={saveCatalogProductLocation}
				/>
			) : null}
			{dialog.type === CatalogProductDialogType.Removing ? (
				<RemoveCatalogLocationDialog
					productName={dialog.product.nome}
					onCancel={closeDialog}
					onConfirm={confirmCatalogProductRemoval}
				/>
			) : null}
		</section>
	);
}
