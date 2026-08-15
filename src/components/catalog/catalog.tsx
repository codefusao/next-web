"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CatalogContent } from "@/components/catalog/catalog-content";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import type { StoreMapMarker } from "@/components/catalog/map/map-types";
import { CatalogLocationMapModal } from "@/components/catalog/modals/location-map-modal";
import { CatalogProductPickerModal } from "@/components/catalog/modals/product-picker-modal";
import { RemoveCatalogLocationDialog } from "@/components/catalog/modals/remove-location-dialog";
import { CatalogProductControls } from "@/components/catalog/products/catalog-product-controls";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useCatalogProductReferences } from "@/hooks/catalog/use-catalog-product-references";
import {
	useCreateStoreCatalogProductMutation,
	useRemoveStoreCatalogProductMutation,
	useStoreCatalogQuery,
	useUpdateStoreCatalogProductMutation,
} from "@/hooks/catalog/use-store-catalog-query";
import { useCompanyQuery } from "@/hooks/use-companies-query";
import { useDepartmentsQuery } from "@/hooks/use-departments-query";
import { useCreateDepartmentMutation } from "@/hooks/use-departments-query";
import { useInventoryQuery } from "@/hooks/use-inventory-query";
import { useStoreMapQuery } from "@/hooks/use-store-map-query";
import type { StoreCatalogLocationFields } from "@/schemas/store-catalog";
import type { Product } from "@/types/product";
import { productOrder, type ProductOrder } from "@/types/product";
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
	const { data: store } = useCompanyQuery(storeId);
	const { data: storeMap = null } = useStoreMapQuery(storeId);
	const { data: departments = [] } = useDepartmentsQuery(storeId);
	const createDepartment = useCreateDepartmentMutation();
	const [catalogQuery, setCatalogQuery] = useState("");
	const [categoryId, setCategoryId] = useState("");
	const [order, setOrder] = useState<ProductOrder>(productOrder.name);
	const [page, setPage] = useState(1);
	const [pickerQuery, setPickerQuery] = useState("");
	const [pickerCategoryId, setPickerCategoryId] = useState("");
	const [pickerOrder, setPickerOrder] = useState<ProductOrder>(productOrder.name);
	const [pickerPage, setPickerPage] = useState(1);
	const { data: catalogResult } = useStoreCatalogQuery(storeId, {
		query: catalogQuery,
		categoryId,
		order,
		page,
		limit: 6,
	});
	const catalogItems = catalogResult?.products ?? [];
	const createCatalogProduct = useCreateStoreCatalogProductMutation();
	const updateCatalogProduct = useUpdateStoreCatalogProductMutation();
	const removeCatalogProduct = useRemoveStoreCatalogProductMutation();
	const [dialog, setDialog] = useState<CatalogProductDialogState>({
		type: CatalogProductDialogType.Closed,
	});
	const { data: inventoryResult, isPending: isInventoryPending } = useInventoryQuery(
		storeId,
	{
			query: pickerQuery,
			categoryId: pickerCategoryId,
			order: pickerOrder,
			page: pickerPage,
		},
	);
	const products = inventoryResult?.products ?? [];
	const catalogProducts = useCatalogProductReferences(catalogItems);
	const catalogProductsToPlace = products;
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

	function updateCatalogQuery(query: string) {
		setCatalogQuery(query);
		setPage(1);
	}

	function updateCategory(nextCategoryId: string) {
		setCategoryId(nextCategoryId);
		setPage(1);
	}

	function updateOrder(nextOrder: ProductOrder) {
		setOrder(nextOrder);
		setPage(1);
	}

	function updatePickerQuery(query: string) {
		setPickerQuery(query);
		setPickerPage(1);
	}

	function updatePickerCategory(nextCategoryId: string) {
		setPickerCategoryId(nextCategoryId);
		setPickerPage(1);
	}

	function updatePickerOrder(nextOrder: ProductOrder) {
		setPickerOrder(nextOrder);
		setPickerPage(1);
	}

	async function createCatalogDepartment(name: string) {
		const department = await createDepartment.mutateAsync({ companyId: storeId, name });
		return department.id;
	}

	async function saveNewLocation(position: StoreCatalogLocationFields) {
		if (dialog.type !== CatalogProductDialogType.Locating) return;

		try {
			await createCatalogProduct.mutateAsync({
				storeId,
				storeMapId: storeMap?.id ?? "",
				referenceProductId: dialog.product.id,
				location: position,
			});
			closeDialog();
			toast.success("Produto localizado no catálogo da loja.");
		} catch (error) {
			console.error(error);
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
		} catch (error) {
			console.error(error);
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
		} catch (error) {
			console.error(error);
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
				storeMapUrl={storeMap?.imageUrl ?? null}
				referencePoints={storeMap?.referencePoints ?? null}
				products={catalogProducts}
				markers={markers}
				onEditLocation={(product) =>
					setDialog({ type: CatalogProductDialogType.Editing, product })
				}
				onRemoveLocation={(product) =>
					setDialog({ type: CatalogProductDialogType.Removing, product })
				}
				query={catalogQuery}
				onQueryChange={updateCatalogQuery}
				categoryId={categoryId}
				order={order}
				meta={catalogResult?.meta}
				onCategoryChange={updateCategory}
				onOrderChange={updateOrder}
				onPreviousPage={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
				onNextPage={() =>
					setPage((currentPage) => Math.min(catalogResult?.meta.totalPages ?? 1, currentPage + 1))
				}
			/>
			{dialog.type === CatalogProductDialogType.ProductPicker ? (
				<CatalogProductPickerModal
					products={catalogProductsToPlace}
					isPending={isInventoryPending}
					controls={
						<CatalogProductControls
							query={pickerQuery}
							categoryId={pickerCategoryId}
							order={pickerOrder}
							onQueryChange={updatePickerQuery}
							onCategoryChange={updatePickerCategory}
							onOrderChange={updatePickerOrder}
							searchLabel="Buscar produtos do estoque"
							searchPlaceholder="Buscar por produto"
							idPrefix="catalog-picker"
						/>
					}
					pagination={
						<PaginationControls
							activePage={inventoryResult?.meta.currentPage ?? 1}
							totalPages={inventoryResult?.meta.totalPages ?? 1}
							onPrevious={() =>
								setPickerPage((currentPage) => Math.max(1, currentPage - 1))
							}
							onNext={() =>
								setPickerPage((currentPage) =>
									Math.min(inventoryResult?.meta.totalPages ?? 1, currentPage + 1),
								)
							}
							label="Paginação dos produtos disponíveis no estoque"
						/>
					}
					onClose={closeDialog}
					onSelect={(product) =>
						setDialog({ type: CatalogProductDialogType.Locating, product })
					}
				/>
			) : null}
			{dialog.type === CatalogProductDialogType.Locating ? (
				<CatalogLocationMapModal
					store={store}
					storeMapUrl={storeMap?.imageUrl ?? null}
					product={dialog.product}
					departments={departments}
					onCreateDepartment={createCatalogDepartment}
					onClose={closeDialog}
					onSave={saveNewLocation}
				/>
			) : null}
			{dialog.type === CatalogProductDialogType.Editing ? (
				<CatalogLocationMapModal
					store={store}
					storeMapUrl={storeMap?.imageUrl ?? null}
					product={dialog.product}
					departments={departments}
					onCreateDepartment={createCatalogDepartment}
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
