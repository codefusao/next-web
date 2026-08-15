"use client";

import { Check, PackageSearch } from "lucide-react";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import type { Product } from "@/types/product";

export type CatalogProductPickerItem = Product & {
	availableQuantity?: number;
};

type CatalogProductPickerModalProps = {
	products: readonly CatalogProductPickerItem[];
	onClose: () => void;
	onSelect: (product: Product) => void;
};

export function CatalogProductPickerModal({
	products,
	onClose,
	onSelect,
}: CatalogProductPickerModalProps) {
	return (
		<Modal
			title="Adicionar produto ao catálogo"
			description="Selecione o produto que será localizado nesta loja."
			closeLabel="Fechar seleção de produto"
			onClose={onClose}
			size="lg"
			layout="scrollable"
		>
			<div className="mt-6">
				{products.length === 0 ? (
					<EmptyState
						icon={PackageSearch}
						title="Nenhum produto encontrado"
						description="Adicione produtos ao inventário para localizá-los na loja."
					/>
				) : (
					<>
						<ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
							{products.map((product) => (
								<li
									key={product.id}
									className="flex items-center gap-3 p-3 sm:p-4"
								>
									<ProductThumbnail
										source={product.image}
										productName={product.nome}
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate font-bold">{product.nome}</p>
										<p className="mt-1 text-sm text-muted">
											{product.categoria.label}
										</p>
										{product.availableQuantity !== undefined ? (
											<p className="mt-1 text-xs font-medium text-muted">
												Disponível no estoque: {product.availableQuantity}
											</p>
										) : null}
									</div>
									<Button
										size="compact"
										disabled={product.availableQuantity === 0}
										onClick={() => onSelect(product)}
									>
										<Check aria-hidden="true" className="size-4" />
										Selecionar
									</Button>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</Modal>
	);
}
