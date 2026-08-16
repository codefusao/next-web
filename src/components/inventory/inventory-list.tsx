"use client";

import { Boxes, PackagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CatalogProductPickerModal } from "@/components/catalog/modals/product-picker-modal";
import { Button } from "@/components/ui/button";
import { InventoryAdjustmentModal } from "@/components/inventory/inventory-adjustment-modal";
import { ProductTable } from "@/components/products/product-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { SearchInput } from "@/components/ui/search-input";
import {
	useInventoryQuery,
	useCreateInventoryMutation,
	useUpdateInventoryMutation,
} from "@/hooks/use-inventory-query";
import { useProductsQuery } from "@/hooks/use-products-query";
import type { InventoryItem } from "@/types/inventory";

type InventoryListProps = {
	storeId: string;
};

export function InventoryList({ storeId }: InventoryListProps) {
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const { data: inventoryResult } = useInventoryQuery(storeId, { query, page });
	const inventoryItems = inventoryResult?.products ?? [];
	const { data: productResult } = useProductsQuery({ notInCompanyId: storeId });
	const products = productResult?.products ?? [];
	const updateInventory = useUpdateInventoryMutation();
	const createInventory = useCreateInventoryMutation();
	const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
	const [isAddingProduct, setIsAddingProduct] = useState(false);
	const meta = inventoryResult?.meta;

	async function saveAdjustment(quantity: number) {
		if (!selectedItem) return;

		try {
			await updateInventory.mutateAsync({
				storeId,
				stockId: selectedItem.stockId,
				quantity,
			});
			toast.success("Estoque atualizado com sucesso.");
			setSelectedItem(null);
		} catch (error) {
			console.error(error);
			toast.error("Não foi possível atualizar o estoque.");
		}
	}

	async function addProduct(productId: string) {
		try {
			await createInventory.mutateAsync({ storeId, productId, quantity: 0 });
			setIsAddingProduct(false);
			toast.success("Produto adicionado ao estoque.");
		} catch (error) {
			console.error(error);
			toast.error("Não foi possível adicionar o produto ao estoque.");
		}
	}

	return (
		<section aria-label="Estoque da loja" className="mt-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex items-center gap-3">
					<span className="inline-flex rounded-[var(--radius-control)] bg-primary/10 p-3 text-primary">
						<Boxes aria-hidden="true" className="size-6" />
					</span>
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-foreground">Estoque</h1>
						<p className="mt-1 text-sm text-muted">Gerencie os produtos disponíveis nesta loja.</p>
					</div>
				</div>
				<Button size="compact" type="button" onClick={() => setIsAddingProduct(true)}>
					<PackagePlus aria-hidden="true" className="size-4" />
					Adicionar produto
				</Button>
			</div>
			<div className="mt-6">
			<SearchInput
				query={query}
				onQueryChange={(nextQuery) => {
					setQuery(nextQuery);
					setPage(1);
				}}
				placeholder="Buscar por produto"
				label="Buscar no estoque"
			/>
			{inventoryItems.length === 0 ? (
				<EmptyState
					icon={Boxes}
					title="Nenhum produto encontrado"
					description="Tente buscar por outro produto, código ou categoria."
				/>
			) : (
				<>
					<ProductTable
						variant="inventory"
						products={inventoryItems}
						onAdjust={setSelectedItem}
					/>
					<PaginationControls
						activePage={meta?.currentPage ?? 1}
						totalPages={meta?.totalPages ?? 1}
						onPrevious={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
						onNext={() =>
							setPage((currentPage) => Math.min(meta?.totalPages ?? 1, currentPage + 1))
						}
						label="Paginação do estoque"
					/>
				</>
			)}
			{selectedItem ? (
				<InventoryAdjustmentModal
					item={selectedItem}
					onClose={() => setSelectedItem(null)}
					onSave={saveAdjustment}
				/>
			) : null}
			{isAddingProduct ? (
				<CatalogProductPickerModal
					products={products}
					onClose={() => setIsAddingProduct(false)}
					onSelect={(product) => addProduct(product.id)}
				/>
			) : null}
			</div>
		</section>
	);
}
