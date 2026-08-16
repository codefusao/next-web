"use client";

import { Boxes, ChartNoAxesColumn, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { StoreActionCard } from "@/components/stores/details/store-action-card";
import { StoreFloorMap } from "@/components/stores/details/store-floor-map";
import { StoreSettings } from "@/components/stores/details/store-settings";
import { ContentCard } from "@/components/ui/content-card";
import { storeStatusLabels } from "@/constants/store";
import type { CompanyListItem } from "@/types/company";

const overviewTabs = ["Visão geral", "Mapa da Loja", "Configurações"] as const;

type StoreOverviewProps = {
	store: CompanyListItem;
	onEdit: () => void;
	onChangeBanner: () => void;
	onChangeMap: () => void;
	onDelete: () => void;
};

type StoreSummaryProps = Pick<StoreOverviewProps, "store">;

type StoreQuickActionsProps = Pick<StoreOverviewProps, "store">;

function StoreSummary({ store }: StoreSummaryProps) {
	const items = [
		{
			label: "Status",
			value: store.status ? storeStatusLabels[store.status] : "Não informado",
		},
		{ label: "Gerente", value: store.manager ?? "Não informado" },
		{ label: "Telefone", value: store.phone ?? "Não informado" },
		{ label: "E-mail", value: store.email ?? "Não informado" },
		{
			label: "Área da loja",
			value: store.area
				? `${store.area.toLocaleString("pt-BR")} m²`
				: "Não informada",
		},
	];

	return (
		<ContentCard aria-labelledby="store-summary-title" className="p-5">
			<h2 id="store-summary-title" className="text-lg font-bold">
				Resumo da loja
			</h2>
			<dl className="mt-3 divide-y divide-border">
				{items.map(({ label, value }) => (
					<div
						key={label}
						className="flex items-center justify-between gap-4 py-3 text-sm"
					>
						<dt className="text-muted">{label}</dt>
						<dd
							className={
								label === "Status" || label === "Gerente"
									? "text-right font-semibold text-primary"
									: "text-right font-medium text-foreground"
							}
						>
							{value}
						</dd>
					</div>
				))}
			</dl>
		</ContentCard>
	);
}

function StoreQuickActions({ store }: StoreQuickActionsProps) {
	const actions = [
		{
			href: `/stores/${store.id}/catalog`,
			icon: Package,
			title: "Catálogo da loja",
			description: "Gerencie os produtos da loja.",
		},
		{
			href: `/stores/${store.id}/inventory`,
			icon: Boxes,
			title: "Estoque",
			description: "Acompanhe o estoque da loja.",
		},
		{
			disabled: true,
			icon: ShoppingCart,
			title: "Pedidos",
			description: "Gerencie os pedidos da loja.",
		},
		{
			disabled: true,
			icon: ChartNoAxesColumn,
			title: "Relatórios",
			description: "Acesse o desempenho da loja.",
		},
	] as const;

	return (
		<ContentCard aria-labelledby="quick-actions-title" className="mt-6 p-5">
			<h2 id="quick-actions-title" className="text-lg font-bold">
				Atalhos rápidos
			</h2>
			<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{actions.map((action) => (
					<StoreActionCard key={action.title} {...action} />
				))}
			</div>
		</ContentCard>
	);
}

export function StoreOverview({
	store,
	onEdit,
	onChangeBanner,
	onChangeMap,
	onDelete,
}: StoreOverviewProps) {
	const [activeTab, setActiveTab] =
		useState<(typeof overviewTabs)[number]>("Visão geral");
	const isSettingsTab = activeTab === "Configurações";
	const isMapTab = activeTab === "Mapa da Loja";

	return (
		<section className="mt-7 px-4 pb-8 sm:px-6 lg:px-0">
			<nav
				aria-label="Seções da loja"
				className="flex overflow-x-auto border-b border-border"
			>
				{overviewTabs.map((tab) => {
					const active = tab === activeTab;
					return (
						<button
							key={tab}
							type="button"
							onClick={() => setActiveTab(tab)}
							className={`shrink-0 border-b-2 px-5 py-3 text-sm font-semibold ${
								active
									? "border-primary text-primary"
									: "cursor-pointer border-transparent text-muted transition-colors hover:border-border hover:text-foreground"
							}`}
						>
							{tab}
						</button>
					);
				})}
			</nav>

			{isSettingsTab ? (
				<StoreSettings
					store={store}
					onEdit={onEdit}
					onChangeBanner={onChangeBanner}
					onDelete={onDelete}
				/>
			) : isMapTab ? (
				<StoreFloorMap store={store} onChangeMap={onChangeMap} />
			) : (
				<>
					<div className="mt-6">
						<StoreSummary store={store} />
					</div>

					<StoreQuickActions store={store} />
				</>
			)}
		</section>
	);
}
