"use client";

import { MapPin, Store } from "lucide-react";
import { useState } from "react";
import { StoresSearch } from "@/components/stores/stores-search";
import { filterStores } from "@/lib/filter-stores";
import type { StoreListItem } from "@/types/store";

type StoresListProps = {
	stores: readonly StoreListItem[];
};

export function StoresList({ stores }: StoresListProps) {
	const [query, setQuery] = useState("");
	const filteredStores = filterStores(stores, query);

	return (
		<section aria-labelledby="stores-list-title">
			<div className="mb-4 flex items-end justify-between gap-4">
				<div>
					<h2 id="stores-list-title" className="text-xl font-bold">
						Lojas cadastradas
					</h2>
					<p className="mt-1 text-sm text-muted">
						Consulte as unidades disponíveis no catálogo.
					</p>
				</div>
				<span className="rounded-full bg-card px-3 py-1 text-sm font-bold text-muted">
					{filteredStores.length}
				</span>
			</div>

			<StoresSearch query={query} onQueryChange={setQuery} />
			{filteredStores.length === 0 ? (
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-12 text-center">
					<Store
						aria-hidden="true"
						className="mx-auto mb-3 size-9 text-muted"
					/>
					<p className="font-semibold">Nenhuma loja encontrada</p>
					<p className="mt-1 text-sm text-muted">
						Tente buscar por outro nome ou endereço.
					</p>
				</div>
			) : (
				<ul className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card">
					{filteredStores.map((store) => (
						<li
							key={store.id}
							className="flex items-start gap-4 border-b border-border px-4 py-4 last:border-b-0 sm:px-5"
						>
							<span className="rounded-lg bg-primary/10 p-2 text-primary">
								<Store aria-hidden="true" className="size-5" />
							</span>
							<div className="min-w-0">
								<h3 className="font-semibold text-foreground">{store.name}</h3>
								<address className="mt-1 flex items-start gap-1.5 text-sm not-italic leading-6 text-muted">
									<MapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />
									<span>{store.address}</span>
								</address>
							</div>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
