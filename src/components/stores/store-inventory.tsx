"use client";

import { ArrowLeft } from "lucide-react";
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
			<InventoryList storeId={store.id} />
		</section>
	);
}
