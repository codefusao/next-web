import { MapPin } from "lucide-react";
import { getGoogleMapsEmbedUrl } from "@/lib/google-maps";

type StoreLocationMapProps = {
	address?: string;
	storeName: string;
};

export function StoreLocationMap({
	address,
	storeName,
}: StoreLocationMapProps) {
	return address ? (
		<iframe
			title={`Localização da loja ${storeName}`}
			src={getGoogleMapsEmbedUrl(address)}
			className="block h-72 w-full rounded-[var(--radius-card)] border-0 shadow-xl"
			loading="lazy"
			referrerPolicy="strict-origin-when-cross-origin"
			allowFullScreen
		/>
	) : (
		<div className="flex h-72 flex-col items-center justify-center rounded-[var(--radius-card)] bg-card/95 px-6 text-center shadow-xl backdrop-blur-sm">
			<MapPin aria-hidden="true" className="mb-3 size-8 text-muted" />
			<p className="font-semibold text-foreground">Endereço não informado</p>
			<p className="mt-1 text-sm text-muted">
				Adicione o endereço da loja para exibir a localização no mapa.
			</p>
		</div>
	);
}
