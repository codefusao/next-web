import { getMapMarkerStyle } from "@/lib/store-map-position";
import type { StoreMapPosition } from "@/types/store-catalog";
import type { MapImageSize } from "./map-types";

type StoreMapReferencePointsProps = {
	points: readonly (StoreMapPosition | null)[];
	imageSize: MapImageSize;
};

export function StoreMapReferencePoints({
	points,
	imageSize,
}: StoreMapReferencePointsProps) {
	return points.map((point, index) =>
		point ? (
			<span
				key={`${point.x}-${point.y}-${index}`}
				style={getMapMarkerStyle(point, undefined, imageSize)}
				className="absolute z-20 inline-flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-card text-xs font-bold text-primary shadow-md"
			>
				{index + 1}
			</span>
		) : null,
	);
}
