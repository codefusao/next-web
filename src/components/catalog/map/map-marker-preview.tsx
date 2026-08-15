"use client";

import { MapPin, Pencil, Trash2 } from "lucide-react";
import {
	useLayoutEffect,
	useRef,
	useState,
	type PointerEvent as ReactPointerEvent,
	type RefObject,
} from "react";
import { createPortal } from "react-dom";
import type { StoreMapMarker } from "@/components/catalog/map/map-types";
import { ProductThumbnail } from "@/components/products/product-thumbnail";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

type StoreMapMarkerPreviewProps = {
	marker: StoreMapMarker;
	anchorRef: RefObject<HTMLDivElement | null>;
	onEdit: (markerId: string) => void;
	onRemove: (markerId: string) => void;
	onPointerEnter: () => void;
	onPointerLeave: () => void;
	onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export function StoreMapMarkerPreview({
	marker,
	anchorRef,
	onEdit,
	onRemove,
	onPointerEnter,
	onPointerLeave,
	onPointerDown,
}: StoreMapMarkerPreviewProps) {
	const { mode } = useTheme();
	const previewRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState<{ left: number; top: number } | null>(
		null,
	);

	useLayoutEffect(() => {
		function updatePosition() {
			const anchor = anchorRef.current;
			const preview = previewRef.current;
			if (!anchor || !preview) return;

			const anchorRect = anchor.getBoundingClientRect();
			const previewRect = preview.getBoundingClientRect();
			const padding = 12;
			const gap = 12;
			const desiredLeft = anchorRect.right + gap;
			const left = Math.min(
				window.innerWidth - previewRect.width - padding,
				Math.max(padding, desiredLeft),
			);
			const top = Math.min(
				window.innerHeight - previewRect.height - padding,
				Math.max(
					padding,
					anchorRect.top + anchorRect.height / 2 - previewRect.height / 2,
				),
			);

			setPosition((current) =>
				current?.left === left && current.top === top ? current : { left, top },
			);
		}

		updatePosition();
		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition, true);
		return () => {
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
		};
	});

	if (typeof document === "undefined") return null;

	return createPortal(
		<div data-theme={mode}>
			<div
				ref={previewRef}
				className={`fixed z-50 w-64 rounded-[var(--radius-control)] border border-border bg-card p-3 text-foreground shadow-xl ${
					position ? "" : "invisible"
				}`}
				onPointerEnter={onPointerEnter}
				onPointerLeave={onPointerLeave}
				onPointerDown={onPointerDown}
				style={{
					left: position?.left ?? 0,
					top: position?.top ?? 0,
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
		</div>,
		document.body,
	);
}
