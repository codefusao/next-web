import { ImageUp } from "lucide-react";
import { InteractiveStoreMap } from "@/components/stores/interactive-store-map";
import { Button } from "@/components/ui/button";
import type { StoreListItem } from "@/types/store";

type StoreFloorMapProps = {
	store: StoreListItem;
	onChangeMap: () => void;
};

export function StoreFloorMap({ store, onChangeMap }: StoreFloorMapProps) {
	return (
		<section
			aria-labelledby="store-map-title"
			className="mt-6 rounded-[var(--radius-card)] border border-border bg-card p-5 sm:p-6"
		>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h2 id="store-map-title" className="text-lg font-bold">
						Mapa interno da loja
					</h2>
					<p className="mt-1 text-sm text-muted">
						Consulte a disposição dos setores dentro da loja.
					</p>
				</div>
				<Button variant="outline" size="compact" onClick={onChangeMap}>
					<ImageUp aria-hidden="true" className="size-4" />
					Alterar mapa
				</Button>
			</div>
			<div className="mt-5">
				<InteractiveStoreMap
					storeMapUrl={store.storeMapUrl}
					storeName={store.name}
				/>
			</div>
		</section>
	);
}
