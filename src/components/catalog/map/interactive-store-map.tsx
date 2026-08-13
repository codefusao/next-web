"use client";

import Image from "next/image";
import { useState } from "react";
import { StoreMapControls } from "@/components/catalog/map/map-controls";
import {
	defaultMapImageSize,
	type MapImageSize,
	type StoreMapMarker,
} from "@/components/catalog/map/map-types";
import { StoreMapMarkers } from "@/components/catalog/map/store-map-markers";
import { useMapMarkerPreview } from "@/hooks/use-map-marker-preview";
import { useStoreMapTransform } from "@/hooks/use-store-map-transform";
import { getMapPositionFromPointer } from "@/lib/store-map-position";
import type { StoreMapPosition } from "@/types/store-catalog";

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

const defaultMarkerSize = 32;
const minimumMarkerSize = 12;
const maximumMarkerSize = 48;

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
	const [imageSize, setImageSize] = useState<MapImageSize>(defaultMapImageSize);
	const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
	const isSelectable = Boolean(onPositionSelect);
	const mapTransform = useStoreMapTransform(!isSelectable);
	const markerPreview = useMapMarkerPreview(onMarkerHover);
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

	function previewMarker(markerId: string) {
		if (selectedMarkerId) return;
		markerPreview.showPreview(markerId);
	}

	return (
		<div
			className="relative aspect-[3/2] w-full overflow-hidden rounded-[var(--radius-control)] bg-background"
			onPointerDown={() => setSelectedMarkerId(null)}
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
				<StoreMapMarkers
					markers={markers}
					selectedPosition={selectedPosition}
					selectedMarkerId={selectedMarkerId}
					highlightedMarkerId={highlightedMarkerId}
					hoveredMarkerId={markerPreview.hoveredMarkerId}
					imageSize={imageSize}
					markerSize={markerSize}
					zoom={mapTransform.zoom}
					onSelectMarker={selectMarker}
					onPreviewMarker={previewMarker}
					onSchedulePreviewClose={markerPreview.schedulePreviewClose}
					onCancelPreviewClose={markerPreview.cancelClose}
					onMarkerClick={onMarkerClick ?? (() => undefined)}
					onMarkerRemove={onMarkerRemove ?? (() => undefined)}
					onStopPointerDown={(event) => event.stopPropagation()}
				/>
			</div>
			{mapTransform.isPanning ? (
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
			{!isSelectable ? (
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
