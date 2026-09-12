"use client";

import { type PointerEvent as ReactPointerEvent, useRef } from "react";
import { MapLocationPin } from "@/components/catalog/map/map-location-pin";
import { StoreMapMarkerPreview } from "@/components/catalog/map/map-marker-preview";
import type {
	MapImageSize,
	StoreMapMarker,
} from "@/components/catalog/map/map-types";
import { getMapMarkerStyle } from "@/lib/store-map-position";
import type { StoreMapPosition } from "@/types/store-catalog";

type StoreMapMarkersProps = {
	markers: readonly StoreMapMarker[];
	selectedPosition: StoreMapPosition | null;
	selectedMarkerId: string | null;
	highlightedMarkerIds: readonly string[];
	hoveredMarkerId: string | null;
	imageSize: MapImageSize;
	markerSize: number;
	onSelectMarker: (
		event: React.MouseEvent<HTMLButtonElement>,
		markerId: string,
	) => void;
	onPreviewMarker: (markerId: string) => void;
	onSchedulePreviewClose: () => void;
	onCancelPreviewClose: () => void;
	onMarkerClick: (markerId: string) => void;
	onMarkerRemove: (markerId: string) => void;
	onStopPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

const markerHitArea =
	"polygon(50% 0%, 73% 8%, 88% 26%, 89% 45%, 80% 62%, 50% 100%, 20% 62%, 11% 45%, 12% 26%, 27% 8%)";

export function StoreMapMarkers({
	markers,
	selectedPosition,
	selectedMarkerId,
	highlightedMarkerIds,
	hoveredMarkerId,
	imageSize,
	markerSize,
	onSelectMarker,
	onPreviewMarker,
	onSchedulePreviewClose,
	onCancelPreviewClose,
	onMarkerClick,
	onMarkerRemove,
	onStopPointerDown,
}: StoreMapMarkersProps) {
	return (
		<>
			{markers.map((marker) => (
				<StoreMapMarkerItem
					key={marker.id}
					marker={marker}
					selectedMarkerId={selectedMarkerId}
					highlightedMarkerIds={highlightedMarkerIds}
					hoveredMarkerId={hoveredMarkerId}
					imageSize={imageSize}
					markerSize={markerSize}
					onSelectMarker={onSelectMarker}
					onPreviewMarker={onPreviewMarker}
					onSchedulePreviewClose={onSchedulePreviewClose}
					onCancelPreviewClose={onCancelPreviewClose}
					onMarkerClick={onMarkerClick}
					onMarkerRemove={onMarkerRemove}
					onStopPointerDown={onStopPointerDown}
				/>
			))}
			{selectedPosition ? (
				<MapLocationPin
					label="Posição selecionada"
					size={28}
					style={getMapMarkerStyle(selectedPosition, undefined, imageSize)}
					className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
				/>
			) : null}
		</>
	);
}

type StoreMapMarkerItemProps = Omit<
	StoreMapMarkersProps,
	"markers" | "selectedPosition"
> & {
	marker: StoreMapMarker;
};

function StoreMapMarkerItem({
	marker,
	selectedMarkerId,
	highlightedMarkerIds,
	hoveredMarkerId,
	imageSize,
	markerSize,
	onSelectMarker,
	onPreviewMarker,
	onSchedulePreviewClose,
	onCancelPreviewClose,
	onMarkerClick,
	onMarkerRemove,
	onStopPointerDown,
}: StoreMapMarkerItemProps) {
	const markerRef = useRef<HTMLDivElement>(null);
	const isPreviewOpen =
		selectedMarkerId === marker.id || hoveredMarkerId === marker.id;

	return (
		<div
			ref={markerRef}
			style={getMapMarkerStyle(marker, undefined, imageSize)}
			className={`absolute ${isPreviewOpen ? "z-40" : "z-20"}`}
		>
			<MapLocationPin
				size={markerSize}
				className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-md transition-[width,height,transform] duration-200 ${
					highlightedMarkerIds.includes(marker.id) ||
					hoveredMarkerId === marker.id
						? "scale-125"
						: ""
				}`}
			/>
			<button
				type="button"
				title={marker.label}
				aria-label={marker.label}
				onClick={(event) => onSelectMarker(event, marker.id)}
				onPointerDown={(event) => event.stopPropagation()}
				onPointerEnter={() => onPreviewMarker(marker.id)}
				onPointerLeave={onSchedulePreviewClose}
				onFocus={() => onPreviewMarker(marker.id)}
				onBlur={onSchedulePreviewClose}
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
					anchorRef={markerRef}
					onEdit={onMarkerClick}
					onRemove={onMarkerRemove}
					onPointerEnter={onCancelPreviewClose}
					onPointerLeave={onSchedulePreviewClose}
					onPointerDown={onStopPointerDown}
				/>
			) : null}
		</div>
	);
}
