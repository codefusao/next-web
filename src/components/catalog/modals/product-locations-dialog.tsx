"use client";

import { MapPin } from "lucide-react";
import { CatalogProductActions } from "@/components/catalog/products/catalog-product-actions";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import { Modal } from "@/components/ui/modal";
import type { CatalogProduct } from "@/types/store-catalog";

type ProductLocationsDialogProps = {
	products: readonly CatalogProduct[];
	onClose: () => void;
	onEditLocation: (product: CatalogProduct) => void;
	onEditQuantity: (product: CatalogProduct) => void;
	onRemoveLocation: (product: CatalogProduct) => void;
};

export function ProductLocationsDialog({
	products,
	onClose,
	onEditLocation,
	onEditQuantity,
	onRemoveLocation,
}: ProductLocationsDialogProps) {
	const product = products[0];
	if (!product) return null;

	return (
		<Modal
			title={product.nome}
			description={`${products.length} ${products.length === 1 ? "localização cadastrada" : "localizações cadastradas"} para este produto.`}
			closeLabel="Fechar localizações do produto"
			onClose={onClose}
			size="lg"
			layout="scrollable"
		>
			<div className="mt-6">
				<ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-background">
					{products.map((catalogProduct) => (
						<li
							key={catalogProduct.id}
							className="flex items-center gap-3 p-3 sm:p-4"
						>
							<ProductThumbnail
								source={catalogProduct.image}
								productName={catalogProduct.nome}
							/>
							<div className="min-w-0 flex-1">
								<p className="flex items-start gap-1.5 text-sm text-foreground">
									<MapPin
										aria-hidden="true"
										className="mt-0.5 size-4 shrink-0 text-primary"
									/>
									<span>{catalogProduct.location.description}</span>
								</p>
								<p className="mt-1 text-xs font-bold text-foreground">
									{catalogProduct.quantity}{" "}
									{catalogProduct.quantity === 1 ? "unidade" : "unidades"}
								</p>
							</div>
							<CatalogProductActions
								catalogProductId={catalogProduct.id}
								productName={catalogProduct.nome}
								onEdit={() => onEditLocation(catalogProduct)}
								onEditQuantity={() => onEditQuantity(catalogProduct)}
								onDelete={() => onRemoveLocation(catalogProduct)}
							/>
						</li>
					))}
				</ul>
			</div>
		</Modal>
	);
}
