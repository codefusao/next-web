import { ArrowLeft, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StoreListItem } from "@/types/store";

type StoreDetailsHeroProps = {
	store: StoreListItem;
};

export function StoreDetailsHero({ store }: StoreDetailsHeroProps) {
	return (
		<>
			<div className="flex h-16 items-center px-4 sm:px-6 lg:px-0">
				<Link
					href="/stores"
					aria-label="Voltar para lojas"
					className="inline-flex size-10 items-center justify-center rounded-[var(--radius-control)] text-muted transition-colors hover:bg-card hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					<ArrowLeft aria-hidden="true" className="size-6" />
				</Link>
			</div>
			<section className="relative h-72 overflow-hidden rounded-[var(--radius-card)] border border-border bg-foreground sm:h-80">
				<Image
					src={store.bannerUrl}
					alt={`Fachada da loja ${store.name}`}
					fill
					priority
					sizes="(min-width: 1024px) calc(100vw - 20rem), 100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />
				<div className="relative flex h-full max-w-2xl flex-col justify-end p-6 text-white sm:p-8">
					<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
						{store.name}
					</h1>
					<p className="mt-3 text-sm font-semibold text-white/90 sm:text-base">
						CNPJ {store.cnpj}
					</p>
					<address className="mt-6 flex items-start gap-2 text-sm font-semibold not-italic leading-6 text-white sm:text-base">
						<MapPin
							aria-hidden="true"
							className="mt-0.5 size-5 shrink-0 text-secondary"
						/>
						<span>{store.address}</span>
					</address>
				</div>
			</section>
		</>
	);
}
