import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef, useState } from "react";

type MapOffset = { x: number; y: number };
type PointerStart = MapOffset & { clientX: number; clientY: number };

const defaultOffset: MapOffset = { x: 0, y: 0 };
const minimumZoom = 0.6;
const defaultZoom = 1;
const maximumZoom = 2;
const zoomStep = 0.2;

export function useStoreMapTransform(isEnabled: boolean) {
	const [zoom, setZoom] = useState(defaultZoom);
	const [offset, setOffset] = useState<MapOffset>(defaultOffset);
	const [isPanning, setIsPanning] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const pointerStart = useRef<PointerStart | null>(null);

	function startPanning(event: ReactPointerEvent<HTMLElement>) {
		if (!isPanning || !isEnabled) return;

		pointerStart.current = {
			clientX: event.clientX,
			clientY: event.clientY,
			x: offset.x,
			y: offset.y,
		};
		setIsDragging(true);
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			finishPanning();
		}
	}

	function moveMap(event: ReactPointerEvent<HTMLElement>) {
		if (!pointerStart.current) return;

		setOffset({
			x: pointerStart.current.x + event.clientX - pointerStart.current.clientX,
			y: pointerStart.current.y + event.clientY - pointerStart.current.clientY,
		});
	}

	function finishPanning(event?: ReactPointerEvent<HTMLElement>) {
		if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		pointerStart.current = null;
		setIsDragging(false);
	}

	function changeZoom(delta: number) {
		setZoom((currentZoom) =>
			Math.min(
				maximumZoom,
				Math.max(minimumZoom, Math.round((currentZoom + delta) * 10) / 10),
			),
		);
	}

	function resetTransform() {
		setZoom(defaultZoom);
		setOffset(defaultOffset);
		setIsPanning(false);
	}

	return {
		isDragging,
		isPanning,
		minimumZoom,
		offset,
		zoom,
		finishPanning,
		moveMap,
		resetTransform,
		startPanning,
		togglePanning: () => setIsPanning((currentValue) => !currentValue),
		zoomIn: () => changeZoom(zoomStep),
		zoomOut: () => changeZoom(-zoomStep),
	};
}
