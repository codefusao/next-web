"use client";

import { ArrowLeft, Boxes } from "lucide-react";
import Link from "next/link";
import { InventoryList } from "@/components/inventory/inventory-list";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { useCompanyQuery } from "@/hooks/use-companies-query";

type StoreInventoryProps = {
	storeId: string;
};

export function StoreInventory({ storeId }: StoreInventoryProps) {
	const { data: store } = useCompanyQuery(storeId);

	if (!store) {
		return (
			<StoreNotFoundState className="mx-auto w-full max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8" />
		);
	}

	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
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
			</div>
			<InventoryList storeId={store.id} />
		</section>
	);
}
