import { useRef, useState } from "react";

const previewCloseDelay = 120;

export function useMapMarkerPreview(
	onMarkerHover?: (markerId: string | null) => void,
) {
	const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
	const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	function cancelClose() {
		if (!closeTimeout.current) return;

		clearTimeout(closeTimeout.current);
		closeTimeout.current = null;
	}

	function showPreview(markerId: string) {
		cancelClose();
		setHoveredMarkerId(markerId);
		onMarkerHover?.(markerId);
	}

	function schedulePreviewClose() {
		cancelClose();
		closeTimeout.current = setTimeout(() => {
			setHoveredMarkerId(null);
			onMarkerHover?.(null);
			closeTimeout.current = null;
		}, previewCloseDelay);
	}

	return {
		hoveredMarkerId,
		cancelClose,
		schedulePreviewClose,
		showPreview,
	};
}
