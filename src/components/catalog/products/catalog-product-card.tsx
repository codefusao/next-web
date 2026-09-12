"use client";

import { ProductThumbnail } from "@/components/products/product-thumbnail";
import type { CatalogProduct } from "@/types/store-catalog";

type CatalogProductCardProps = {
	product: CatalogProduct;
	locationsCount: number;
	isHighlighted: boolean;
	onShowLocations: () => void;
	onProductHover: (referenceProductId: string | null) => void;
};

export function CatalogProductCard({
	product,
	locationsCount,
	isHighlighted,
	onShowLocations,
	onProductHover,
}: CatalogProductCardProps) {
	return (
		<article
			className={`group relative flex h-52 flex-col rounded-[var(--radius-card)] border bg-transparent p-3 transition-all duration-200 ${
				isHighlighted
					? "border-primary ring-2 ring-primary/15"
					: "border-border hover:border-primary/40"
			}`}
			onMouseEnter={() => onProductHover(product.referenceProductId)}
			onMouseLeave={() => onProductHover(null)}
			onFocus={() => onProductHover(product.referenceProductId)}
			onBlur={() => onProductHover(null)}
		>
			<button
				type="button"
				className="flex h-full w-full flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				onClick={onShowLocations}
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
				<p className="mt-auto text-xs font-bold text-primary">
					{locationsCount}{" "}
					{locationsCount === 1 ? "localização" : "localizações"}
				</p>
			</button>
		</article>
	);
}
