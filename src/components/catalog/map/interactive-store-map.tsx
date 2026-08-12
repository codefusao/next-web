"use client";

import Image from "next/image";
import { useState } from "react";
import { StoreMapControls } from "@/components/catalog/map/map-controls";
import { MapLocationPin } from "@/components/catalog/map/map-location-pin";
import { StoreMapMarkerPreview } from "@/components/catalog/map/map-marker-preview";
import { useMapMarkerPreview } from "@/hooks/use-map-marker-preview";
import { useStoreMapTransform } from "@/hooks/use-store-map-transform";
import {
	getMapMarkerStyle,
	getMapPositionFromPointer,
} from "@/lib/store-map-position";
import type { StoreMapPosition } from "@/types/store-catalog";

export type StoreMapMarker = StoreMapPosition & {
	id: string;
	label: string;
	productId: string;
	productName: string;
	productCategory: string;
	productImage: string | null;
	locationLabel: string;
};

type ImageSize = { width: number; height: number };
type InteractiveStoreMapProps = {
	storeMapUrl: string;
	storeName: string;
	markers?: readonly StoreMapMarker[];
	selectedPosition?: StoreMapPosition | null;
	highlightedMarkerId?: string | null;
	onPositionSelect?: (position: StoreMapPosition) => void;
	onMarkerClick?: (markerId: string) => void;
	onMarkerRemove?: (markerId: string) => void;
	onMarkerHover?: (markerId: string | null) => void;
};

const defaultImageSize: ImageSize = { width: 3, height: 2 };
const defaultMarkerSize = 32;
const minimumMarkerSize = 12;
const maximumMarkerSize = 48;
const markerHitArea =
	"polygon(50% 0%, 73% 8%, 88% 26%, 89% 45%, 80% 62%, 50% 100%, 20% 62%, 11% 45%, 12% 26%, 27% 8%)";

function getMarkerSize(zoom: number) {
	return Math.min(
		maximumMarkerSize,
		Math.max(minimumMarkerSize, defaultMarkerSize / zoom ** 2),
	);
}

export function InteractiveStoreMap({
	storeMapUrl,
	storeName,
	markers = [],
	selectedPosition = null,
	highlightedMarkerId = null,
	onPositionSelect,
	onMarkerClick,
	onMarkerRemove,
	onMarkerHover,
}: InteractiveStoreMapProps) {
	const [imageSize, setImageSize] = useState<ImageSize>(defaultImageSize);
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
	const isSelectable = Boolean(onPositionSelect);
	const canTransformMap = !isSelectable;
	const markerPreview = useMapMarkerPreview(onMarkerHover);
	const mapTransform = useStoreMapTransform(canTransformMap);
	const markerSize = getMarkerSize(mapTransform.zoom);

	function selectPosition(event: React.MouseEvent<HTMLButtonElement>) {
		if (!onPositionSelect) return;
		const position = getMapPositionFromPointer(
			event.clientX,
			event.clientY,
			event.currentTarget.getBoundingClientRect(),
			imageSize,
		);
		if (position) onPositionSelect(position);
	}

	function selectMarker(
		event: React.MouseEvent<HTMLButtonElement>,
		markerId: string,
	) {
		event.stopPropagation();
		setSelectedMarkerId(markerId);
		markerPreview.showPreview(markerId);
	}

	function clearSelectedMarker() {
		setSelectedMarkerId(null);
	}

	function previewMarker(markerId: string) {
		if (selectedMarkerId) return;

		markerPreview.showPreview(markerId);
	}

	return (
		<div
			className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-control)] bg-background"
			onPointerDown={clearSelectedMarker}
		>
			<div
				className="absolute inset-0"
				style={{
					transform: `translate(${mapTransform.offset.x}px, ${mapTransform.offset.y}px) scale(${mapTransform.zoom})`,
					transition: mapTransform.isDragging
						? "none"
						: "transform 200ms ease-out",
				}}
			>
				<Image
					src={storeMapUrl}
					alt={`Mapa interno da loja ${storeName}`}
					fill
					sizes="(min-width: 1280px) 1100px, 100vw"
					className="object-contain"
					unoptimized={storeMapUrl.startsWith("data:")}
					onLoad={(event) =>
						setImageSize({
							width: event.currentTarget.naturalWidth,
							height: event.currentTarget.naturalHeight,
						})
					}
				/>
				{isSelectable ? (
					<button
						type="button"
						className="absolute inset-0 cursor-crosshair focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
						onClick={selectPosition}
						aria-label="Selecione a posição do produto no mapa"
					/>
				) : null}
				{markers.map((marker) => {
					const isPreviewOpen =
						selectedMarkerId === marker.id ||
						markerPreview.hoveredMarkerId === marker.id;

					return (
						<div
							key={marker.id}
							style={getMapMarkerStyle(marker, defaultImageSize, imageSize)}
							className={`absolute ${isPreviewOpen ? "z-40" : "z-20"}`}
						>
							<MapLocationPin
								size={markerSize}
								className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-md transition-[width,height,transform] duration-200 ${
									highlightedMarkerId === marker.id ||
									markerPreview.hoveredMarkerId === marker.id
										? "scale-125"
										: ""
								}`}
							/>
							<button
								type="button"
								title={marker.label}
								aria-label={marker.label}
								onClick={(event) => selectMarker(event, marker.id)}
								onPointerDown={(event) => event.stopPropagation()}
								onPointerEnter={() => previewMarker(marker.id)}
								onPointerLeave={markerPreview.schedulePreviewClose}
								onFocus={() => previewMarker(marker.id)}
								onBlur={markerPreview.schedulePreviewClose}
								style={{
									clipPath: markerHitArea,
									height: markerSize,
									width: markerSize,
								}}
								className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							/>
							{isPreviewOpen ? (
								<StoreMapMarkerPreview
									marker={marker}
									zoom={mapTransform.zoom}
									onEdit={onMarkerClick ?? (() => undefined)}
									onRemove={onMarkerRemove ?? (() => undefined)}
									onPointerEnter={markerPreview.cancelClose}
									onPointerLeave={markerPreview.schedulePreviewClose}
									onPointerDown={(event) => event.stopPropagation()}
								/>
							) : null}
						</div>
					);
				})}
				{selectedPosition ? (
					<MapLocationPin
						label="Posição selecionada"
						size={28}
						style={getMapMarkerStyle(
							selectedPosition,
							defaultImageSize,
							imageSize,
						)}
						className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
					/>
				) : null}
			</div>
			{canTransformMap && mapTransform.isPanning ? (
				<button
					type="button"
					className="absolute inset-0 z-30 cursor-grab touch-none active:cursor-grabbing"
					onPointerDown={mapTransform.startPanning}
					onPointerMove={mapTransform.moveMap}
					onPointerUp={mapTransform.finishPanning}
					onPointerCancel={mapTransform.finishPanning}
					aria-label="Arraste para mover o mapa"
				/>
			) : null}
			{canTransformMap ? (
				<StoreMapControls
					zoom={mapTransform.zoom}
					minimumZoom={mapTransform.minimumZoom}
					isPanning={mapTransform.isPanning}
					onZoomOut={mapTransform.zoomOut}
					onZoomIn={mapTransform.zoomIn}
					onTogglePanning={mapTransform.togglePanning}
					onReset={mapTransform.resetTransform}
				/>
			) : null}
		</div>
	);
}
