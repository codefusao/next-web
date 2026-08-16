import type { PointerEvent as ReactPointerEvent } from "react";
import { useReducer, useRef } from "react";

type MapOffset = { x: number; y: number };
type PointerStart = MapOffset & { clientX: number; clientY: number };

const defaultOffset: MapOffset = { x: 0, y: 0 };
const minimumZoom = 0.6;
const defaultZoom = 1;
const maximumZoom = 2;
const zoomStep = 0.2;
const zoomPrecision = 10;

type StoreMapTransformState = {
	zoom: number;
	offset: MapOffset;
	isPanning: boolean;
	isDragging: boolean;
};

enum StoreMapTransformActionType {
	PanStarted = "pan-started",
	PanMoved = "pan-moved",
	PanFinished = "pan-finished",
	PanningToggled = "panning-toggled",
	ZoomChanged = "zoom-changed",
	Reset = "reset",
}

type StoreMapTransformAction =
	| { type: StoreMapTransformActionType.PanStarted }
	| { type: StoreMapTransformActionType.PanMoved; offset: MapOffset }
	| { type: StoreMapTransformActionType.PanFinished }
	| { type: StoreMapTransformActionType.PanningToggled }
	| { type: StoreMapTransformActionType.ZoomChanged; delta: number }
	| { type: StoreMapTransformActionType.Reset };

const initialTransformState: StoreMapTransformState = {
	zoom: defaultZoom,
	offset: defaultOffset,
	isPanning: false,
	isDragging: false,
};

function storeMapTransformReducer(
	state: StoreMapTransformState,
	action: StoreMapTransformAction,
): StoreMapTransformState {
	switch (action.type) {
		case StoreMapTransformActionType.PanStarted:
			return state.isPanning ? { ...state, isDragging: true } : state;
		case StoreMapTransformActionType.PanMoved:
			if (!state.isDragging) return state;
			return { ...state, offset: action.offset };
		case StoreMapTransformActionType.PanFinished:
			return { ...state, isDragging: false };
		case StoreMapTransformActionType.PanningToggled:
			return {
				...state,
				isPanning: !state.isPanning,
				isDragging: false,
			};
		case StoreMapTransformActionType.ZoomChanged:
			return {
				...state,
				zoom: Math.min(
					maximumZoom,
					Math.max(
						minimumZoom,
						Math.round((state.zoom + action.delta) * zoomPrecision) /
							zoomPrecision,
					),
				),
			};
		case StoreMapTransformActionType.Reset:
			return initialTransformState;
	}
}

export function useStoreMapTransform(isEnabled: boolean) {
	const [transform, dispatch] = useReducer(
		storeMapTransformReducer,
		initialTransformState,
	);
	const pointerStart = useRef<PointerStart | null>(null);

	function startPanning(event: ReactPointerEvent<HTMLElement>) {
		if (!transform.isPanning || !isEnabled) return;

		pointerStart.current = {
			clientX: event.clientX,
			clientY: event.clientY,
			x: transform.offset.x,
			y: transform.offset.y,
		};
		dispatch({ type: StoreMapTransformActionType.PanStarted });
		try {
			event.currentTarget.setPointerCapture(event.pointerId);
		} catch {
			finishPanning();
		}
	}

	function moveMap(event: ReactPointerEvent<HTMLElement>) {
		if (!pointerStart.current) return;

		dispatch({
			type: StoreMapTransformActionType.PanMoved,
			offset: {
				x:
					pointerStart.current.x + event.clientX - pointerStart.current.clientX,
				y:
					pointerStart.current.y + event.clientY - pointerStart.current.clientY,
			},
		});
	}

	function finishPanning(event?: ReactPointerEvent<HTMLElement>) {
		if (event?.currentTarget.hasPointerCapture(event.pointerId)) {
			event.currentTarget.releasePointerCapture(event.pointerId);
		}
		pointerStart.current = null;
		dispatch({ type: StoreMapTransformActionType.PanFinished });
	}

	function changeZoom(delta: number) {
		dispatch({ type: StoreMapTransformActionType.ZoomChanged, delta });
	}

	function resetTransform() {
		dispatch({ type: StoreMapTransformActionType.Reset });
	}

	return {
		isDragging: transform.isDragging,
		isPanning: transform.isPanning,
		minimumZoom,
		offset: transform.offset,
		zoom: transform.zoom,
		finishPanning,
		moveMap,
		resetTransform,
		startPanning,
		togglePanning: () =>
			dispatch({ type: StoreMapTransformActionType.PanningToggled }),
		zoomIn: () => changeZoom(zoomStep),
		zoomOut: () => changeZoom(-zoomStep),
	};
}
