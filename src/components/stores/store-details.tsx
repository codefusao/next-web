"use client";

import { ArrowLeft, FileText, GitBranch, MapPin, Store } from "lucide-react";
import Link from "next/link";
import { useStoresStore } from "@/store/stores-store";

type StoreDetailsProps = {
	storeId: string;
};

type DetailItemProps = {
	label: string;
	children: React.ReactNode;
};

function DetailItem({ label, children }: DetailItemProps) {
	return (
		<div className="rounded-[var(--radius-sm)] bg-background p-4">
			<p className="text-xs font-bold uppercase tracking-wide text-muted">
				{label}
			</p>
			<div className="mt-1 text-sm leading-6 text-foreground">{children}</div>
		</div>
	);
}

export function StoreDetails({ storeId }: StoreDetailsProps) {
	const store = useStoresStore((state) =>
		state.stores.find((item) => item.id === storeId),
	);

	if (!store) {
		return (
			<section className="rounded-[var(--radius-card)] border border-dashed border-border bg-card px-6 py-14 text-center">
				<Store
					aria-hidden="true"
					className="mx-auto mb-4 size-10 text-primary"
				/>
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
			</section>
		);
	}

	return (
		<section>
			<Link
				href="/stores"
				className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<ArrowLeft aria-hidden="true" className="size-4" />
				Voltar para lojas
			</Link>

			<div className="rounded-[var(--radius-card)] border border-border bg-card p-5 shadow-sm sm:p-7">
				<div className="flex items-start gap-4">
					<span className="rounded-lg bg-primary/10 p-3 text-primary">
						<Store aria-hidden="true" className="size-7" />
					</span>
					<div>
						<p className="text-sm font-semibold text-primary">Unidade</p>
						<h1 className="mt-1 text-3xl font-bold tracking-tight">
							{store.name}
						</h1>
					</div>
				</div>

				<div className="mt-7 grid gap-4 md:grid-cols-2">
					{store.cnpj ? (
						<DetailItem label="CNPJ">{store.cnpj}</DetailItem>
					) : null}
					{store.parentId ? (
						<DetailItem label="Empresa matriz">
							<span className="flex items-start gap-2 break-all">
								<GitBranch
									aria-hidden="true"
									className="mt-1 size-4 shrink-0 text-muted"
								/>
								{store.parentId}
							</span>
						</DetailItem>
					) : null}
					{store.address ? (
						<DetailItem label="Endereço">
							<span className="flex items-start gap-2">
								<MapPin
									aria-hidden="true"
									className="mt-1 size-4 shrink-0 text-muted"
								/>
								{store.address}
							</span>
						</DetailItem>
					) : null}
					{store.description ? (
						<DetailItem label="Descrição">
							<span className="flex items-start gap-2">
								<FileText
									aria-hidden="true"
									className="mt-1 size-4 shrink-0 text-muted"
								/>
								{store.description}
							</span>
						</DetailItem>
					) : null}
				</div>
			</div>
		</section>
	);
}
