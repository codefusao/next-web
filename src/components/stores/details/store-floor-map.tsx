import { ImageUp, MapPinned } from "lucide-react";
import { useState } from "react";
import { InteractiveStoreMap } from "@/components/catalog/map/interactive-store-map";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/ui/content-card";
import { StoreMapReferencePointsModal } from "@/components/stores/modals/store-map-reference-points-modal";
import { useStoreMapQuery } from "@/hooks/use-store-map-query";
import type { CompanyListItem } from "@/types/company";

type StoreFloorMapProps = {
	store: CompanyListItem;
	onChangeMap: () => void;
};

export function StoreFloorMap({ store, onChangeMap }: StoreFloorMapProps) {
	const { data: storeMap = null, isLoading } = useStoreMapQuery(store.id);
	const [isReferencePointsOpen, setIsReferencePointsOpen] = useState(false);

	return (
		<ContentCard aria-labelledby="store-map-title" className="mt-6 p-5 sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 id="store-map-title" className="text-lg font-bold">
						Mapa interno da loja
					</h2>
					<p className="mt-1 text-sm text-muted">
						Consulte a disposição dos setores dentro da loja.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="compact" onClick={() => setIsReferencePointsOpen(true)} disabled={!storeMap}>
						<MapPinned aria-hidden="true" className="size-4" />
						Pontos de referência
					</Button>
					<Button variant="outline" size="compact" onClick={onChangeMap}>
						<ImageUp aria-hidden="true" className="size-4" />
						Alterar mapa
					</Button>
				</div>
			</div>
			<div className="mt-5">
				{isLoading ? (
					<div className="flex aspect-[3/2] items-center justify-center rounded-[var(--radius-control)] bg-muted text-sm text-muted">
						Carregando mapa interno...
					</div>
				) : (
					<InteractiveStoreMap
						storeMapUrl={storeMap?.imageUrl ?? null}
						storeName={store.name}
						referencePoints={storeMap?.referencePoints ?? []}
					/>
				)}
			</div>
			{isReferencePointsOpen && storeMap ? (
				<StoreMapReferencePointsModal store={store} storeMap={storeMap} onClose={() => setIsReferencePointsOpen(false)} />
			) : null}
		</ContentCard>
	);
}
