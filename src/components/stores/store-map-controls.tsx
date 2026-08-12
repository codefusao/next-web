"use client";

import { Maximize, Minus, Move, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type StoreMapControlsProps = {
	zoom: number;
	minimumZoom: number;
	isPanning: boolean;
	onZoomOut: () => void;
	onZoomIn: () => void;
	onTogglePanning: () => void;
	onReset: () => void;
};

export function StoreMapControls({
	zoom,
	minimumZoom,
	isPanning,
	onZoomOut,
	onZoomIn,
	onTogglePanning,
	onReset,
}: StoreMapControlsProps) {
	return (
		<div className="absolute right-3 top-3 z-40 flex overflow-hidden rounded-[var(--radius-control)] border border-border bg-card shadow-sm">
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={onZoomOut}
				disabled={zoom <= minimumZoom}
				aria-label="Diminuir zoom do mapa"
			>
				<Minus aria-hidden="true" className="size-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={onZoomIn}
				disabled={zoom >= 2}
				aria-label="Aumentar zoom do mapa"
			>
				<Plus aria-hidden="true" className="size-4" />
			</Button>
			<Button
				variant={isPanning ? "primary" : "ghost"}
				size="icon-sm"
				onClick={onTogglePanning}
				aria-pressed={isPanning}
				aria-label="Mover imagem do mapa"
			>
				<Move aria-hidden="true" className="size-4" />
			</Button>
			<Button
				variant="ghost"
				size="icon-sm"
				onClick={onReset}
				aria-label="Restaurar posição do mapa"
			>
				<Maximize aria-hidden="true" className="size-4" />
			</Button>
		</div>
	);
}
