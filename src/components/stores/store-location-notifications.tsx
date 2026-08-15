"use client";

import { ArrowLeft, BellRing, Clock3 } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { StoreNotFoundState } from "@/components/stores/store-not-found-state";
import { useCompanyQuery } from "@/hooks/use-companies-query";
import { useNotificationsQuery } from "@/hooks/use-notifications-query";
import { useState } from "react";

type StoreLocationNotificationsProps = { storeId: string };

function formatDate(value: string) {
	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}

export function StoreLocationNotifications({ storeId }: StoreLocationNotificationsProps) {
	const [page, setPage] = useState(1);
	const { data: store } = useCompanyQuery(storeId);
	const { data } = useNotificationsQuery(storeId, page);
	const notifications = data?.notifications ?? [];
	const meta = data?.meta;

	if (!store) return <StoreNotFoundState className="mx-auto w-full max-w-7xl px-4 py-6 text-center sm:px-6 sm:py-8" />;

	return (
		<section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<Link href={`/stores/${storeId}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
				<ArrowLeft aria-hidden="true" className="size-4" /> Voltar para {store.name}
			</Link>
			<div className="mt-5 flex items-center gap-3">
				<span className="inline-flex rounded-[var(--radius-control)] bg-primary/10 p-3 text-primary"><BellRing aria-hidden="true" className="size-6" /></span>
				<div><h1 className="text-3xl font-bold tracking-tight">Avisos de localização</h1><p className="mt-1 text-sm text-muted">Clientes informaram que não encontraram um item no local indicado.</p></div>
			</div>
			<div className="mt-6 space-y-3">
				{notifications.length === 0 ? (
					<EmptyState icon={BellRing} title="Nenhum aviso de localização" description="Novos avisos enviados pelo aplicativo aparecerão aqui." />
				) : notifications.map((notification) => (
					<article key={notification.id} className="rounded-[var(--radius-card)] border border-border bg-card p-4 sm:p-5">
						<div className="flex items-start gap-3"><BellRing aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><h2 className="font-bold">{notification.title}</h2><p className="mt-1 text-sm leading-6 text-muted">{notification.message}</p><p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted"><Clock3 aria-hidden="true" className="size-3.5" />{formatDate(notification.createdAt)}</p></div></div>
					</article>
				))}
			</div>
			{notifications.length > 0 ? <PaginationControls activePage={meta?.currentPage ?? 1} totalPages={meta?.totalPages ?? 1} onPrevious={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(meta?.totalPages ?? 1, current + 1))} label="Paginação dos avisos de localização" /> : null}
		</section>
	);
}
