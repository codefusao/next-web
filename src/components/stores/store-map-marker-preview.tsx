"use client";

import { MapPin, Pencil, Trash2 } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import type { StoreMapMarker } from "@/components/stores/interactive-store-map";
import { Button } from "@/components/ui/button";

type StoreMapMarkerPreviewProps = {
	marker: StoreMapMarker;
	zoom: number;
	onEdit: (markerId: string) => void;
	onRemove: (markerId: string) => void;
	onPointerEnter: () => void;
	onPointerLeave: () => void;
	onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export function StoreMapMarkerPreview({
	marker,
	zoom,
	onEdit,
	onRemove,
	onPointerEnter,
	onPointerLeave,
	onPointerDown,
}: StoreMapMarkerPreviewProps) {
	const opensToLeft = marker.x > 62;

	return (
		<div
			className="absolute z-30 w-64 rounded-[var(--radius-control)] border border-border bg-card p-3 text-foreground shadow-xl"
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			onPointerDown={onPointerDown}
			style={{
				left: 0,
				top: 0,
				transform: `${
					opensToLeft ? "translate(-100%, -50%)" : "translate(0, -50%)"
				} scale(${1 / zoom})`,
				transformOrigin: opensToLeft ? "right center" : "left center",
			}}
		>
			<Button
				variant="ghost"
				size="icon-sm"
				className="absolute right-3 top-3 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:outline-destructive"
				onClick={() => onRemove(marker.id)}
				aria-label={`Remover ${marker.productName} do mapa`}
			>
				<Trash2 aria-hidden="true" className="size-4" />
			</Button>
			<div className="flex items-start gap-3 pr-7">
				<ProductThumbnail
					source={marker.productImage}
					productName={marker.productName}
				/>
				<div className="min-w-0 flex-1">
					<p className="line-clamp-2 text-sm font-bold leading-5">
						{marker.productName}
					</p>
					<p className="mt-1 text-xs text-muted">{marker.productCategory}</p>
					<p className="mt-2 flex items-center gap-1 text-xs text-muted">
						<MapPin aria-hidden="true" className="size-3 text-primary" />
						{marker.locationLabel}
					</p>
				</div>
			</div>
			<Button
				variant="outline"
				size="compact"
				className="mt-3 w-full"
				onClick={() => onEdit(marker.id)}
			>
				<Pencil aria-hidden="true" className="size-4" />
				Editar no mapa
			</Button>
		</div>
	);
}
