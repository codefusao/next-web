"use client";

import { MapPin } from "lucide-react";
import { CatalogProductActions } from "@/components/catalog/products/catalog-product-actions";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import type { CatalogProduct } from "@/types/store-catalog";

type CatalogProductCardProps = {
	product: CatalogProduct;
	isHighlighted: boolean;
	onEditLocation: (product: CatalogProduct) => void;
	onRemoveLocation: (product: CatalogProduct) => void;
	onHighlightedProductLocationChange: (catalogProductId: string | null) => void;
};

export function CatalogProductCard({
	product,
	isHighlighted,
	onEditLocation,
	onRemoveLocation,
	onHighlightedProductLocationChange,
}: CatalogProductCardProps) {
	return (
		<article
			className={`group relative flex h-52 flex-col rounded-[var(--radius-card)] border bg-transparent p-3 transition-all duration-200 ${
				isHighlighted
					? "border-primary ring-2 ring-primary/15"
					: "border-border hover:border-primary/40"
			}`}
			onMouseEnter={() => onHighlightedProductLocationChange(product.id)}
			onMouseLeave={() => onHighlightedProductLocationChange(null)}
			onFocus={() => onHighlightedProductLocationChange(product.id)}
			onBlur={() => onHighlightedProductLocationChange(null)}
		>
			<div className="flex items-start justify-center">
				<ProductThumbnail source={product.image} productName={product.nome} />
			</div>
			<div className="mt-3">
				<h3 className="line-clamp-2 text-sm font-bold leading-4 text-foreground">
					{product.nome}
				</h3>
				<p className="mt-1 truncate text-xs text-muted">
					{product.categoria.label}
				</p>
			</div>
			<div className="pt-2">
				<p className="flex items-start gap-1.5 text-[10px] leading-4 text-muted">
					<MapPin
						aria-hidden="true"
						className="mt-0.5 size-3.5 shrink-0 text-primary"
					/>
					<span>{product.location.description}</span>
				</p>
				<div className="mt-1 flex justify-end">
					<CatalogProductActions
						productName={product.nome}
						onEdit={() => onEditLocation(product)}
						onDelete={() => onRemoveLocation(product)}
					/>
				</div>
			</div>
		</article>
	);
}
