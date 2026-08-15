import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CompanyListItem } from "@/types/company";

type StoreCardProps = {
	store: CompanyListItem;
};

export function StoreCard({ store }: StoreCardProps) {
	return (
		<Link
			href={`/stores/${store.id}`}
			className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			<div className="relative aspect-[11/6] overflow-hidden bg-muted">
				{store.bannerUrl ? (
					<Image
						src={store.bannerUrl}
						alt={`Fachada da loja ${store.name}`}
						width={880}
						height={480}
						sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				) : null}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
			</div>
			<div className="flex min-h-30 flex-1 flex-col p-4">
				<h3 className="text-base font-bold text-foreground">{store.name}</h3>
				{store.address ? (
					<address className="mt-auto flex items-start gap-1.5 text-sm not-italic leading-6 text-muted">
						<MapPin
							aria-hidden="true"
							className="mt-1 size-4 shrink-0 text-primary"
						/>
						<span>{store.address}</span>
					</address>
				) : null}
			</div>
		</Link>
	);
}
