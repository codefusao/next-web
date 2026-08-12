"use client";

import { ArrowLeft, Boxes, MapPin } from "lucide-react";
import Link from "next/link";
import { InventoryList } from "@/components/inventory/inventory-list";
import { useStoresStore } from "@/store/stores-store";

type StoreInventoryProps = {
	storeId: string;
};

export function StoreInventory({ storeId }: StoreInventoryProps) {
	const store = useStoresStore((state) =>
		state.stores.find((item) => item.id === storeId),
	);

	if (!store) {
		return (
			<section className="text-center">
				<div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-14">
					<h1 className="text-2xl font-bold">Loja não encontrada</h1>
					<p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
						A loja solicitada não está disponível na lista local.
					</p>
					<Link
						href="/stores"
						className="mt-6 inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
					>
						<ArrowLeft aria-hidden="true" className="size-4" />
						Voltar para lojas
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section>
			<Link
				href={`/stores/${store.id}`}
				className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Voltar para detalhes da loja
			</Link>
			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<div className="flex items-center gap-3">
						<span className="inline-flex rounded-[var(--radius-control)] bg-primary/10 p-3 text-primary">
							<Boxes aria-hidden="true" className="size-6" />
						</span>
						<div>
							<h1 className="text-3xl font-bold tracking-tight text-foreground">
								Estoque
							</h1>
							<p className="mt-1 text-sm text-muted">
								Gerencie os produtos disponíveis nesta loja.
							</p>
						</div>
					</div>
				</div>
				<div className="text-sm sm:text-right">
					<p className="font-bold text-foreground">{store.name}</p>
					{store.address ? (
						<address className="mt-1 flex items-start gap-1.5 not-italic text-muted sm:justify-end">
							<MapPin
								aria-hidden="true"
								className="mt-0.5 size-4 shrink-0 text-primary"
							/>
							<span>{store.address}</span>
						</address>
					) : null}
				</div>
			</div>
			<InventoryList storeId={store.id} />
		</section>
	);
}
