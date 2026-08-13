import type { StoreMapPosition } from "@/types/store-catalog";

type MapFrame = {
	left: number;
	top: number;
	width: number;
	height: number;
};

type MapSize = {
	width: number;
	height: number;
};

const defaultMapSize: MapSize = { width: 3, height: 2 };
const coordinateScale = 100;
const coordinatePrecision = 100;

function getMapFrame(container: MapSize, image: MapSize): MapFrame {
	const imageRatio = image.width / image.height;
	const containerRatio = container.width / container.height;

	if (imageRatio >= containerRatio) {
		const height = container.width / imageRatio;
		return {
			left: 0,
			top: (container.height - height) / 2,
			width: container.width,
			height,
		};
	}

	const width = container.height * imageRatio;
	return {
		left: (container.width - width) / 2,
		top: 0,
		width,
		height: container.height,
	};
}

function roundCoordinate(value: number) {
	return Math.round(value * coordinatePrecision) / coordinatePrecision;
}

export function getMapPositionFromPointer(
	clientX: number,
	clientY: number,
	containerRect: DOMRect,
	imageSize: MapSize = defaultMapSize,
): StoreMapPosition | null {
	const frame = getMapFrame(
		{ width: containerRect.width, height: containerRect.height },
		imageSize,
	);
	const offsetX = clientX - containerRect.left - frame.left;
	const offsetY = clientY - containerRect.top - frame.top;

	if (
		offsetX < 0 ||
		offsetY < 0 ||
		offsetX > frame.width ||
		offsetY > frame.height
	) {
		return null;
	}

	return {
		x: roundCoordinate((offsetX / frame.width) * coordinateScale),
		y: roundCoordinate((offsetY / frame.height) * coordinateScale),
	};
}

export function getMapMarkerStyle(
	position: StoreMapPosition,
	containerSize: MapSize = defaultMapSize,
	imageSize: MapSize = defaultMapSize,
) {
	const frame = getMapFrame(containerSize, imageSize);

	return {
		left: `${((frame.left + (position.x / coordinateScale) * frame.width) / containerSize.width) * coordinateScale}%`,
		top: `${((frame.top + (position.y / coordinateScale) * frame.height) / containerSize.height) * coordinateScale}%`,
	};
}
