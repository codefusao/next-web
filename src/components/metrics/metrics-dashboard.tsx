"use client";

import {
	Activity,
	Building2,
	Globe,
	RefreshCw,
	Route,
	Users,
} from "lucide-react";

import {
	useMetricsOverviewQuery,
	useTopCompaniesQuery,
	useTopPathsQuery,
} from "@/hooks/use-metrics-query";

import { ContentCard } from "@/components/ui/content-card";

function formatNumber(value: number) {
	return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDate(value: string) {
	const date = new Date(`${value}T00:00:00`);

	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
	}).format(date);
}

function MetricCard({
	title,
	value,
	description,
	icon: Icon,
}: {
	title: string;
	value: string;
	description: string;
	icon: typeof Activity;
}) {
	return (
		<ContentCard className="p-5">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<p className="text-sm font-semibold text-muted">
						{title}
					</p>

					<p className="mt-2 text-2xl font-bold text-foreground">
						{value}
					</p>

					<p className="mt-1 text-xs text-muted">
						{description}
					</p>
				</div>

				<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Icon className="size-5" />
				</div>
			</div>
		</ContentCard>
	);
}

export function MetricsDashboard() {
	const overviewQuery = useMetricsOverviewQuery();

	const topPathsQuery = useTopPathsQuery({
		limit: 10,
	});

	const topCompaniesQuery = useTopCompaniesQuery({
		limit: 10,
	});

	const overview = overviewQuery.data;
	const topPaths = topPathsQuery.data ?? [];
	const topCompanies = topCompaniesQuery.data ?? [];

	const isLoading =
		overviewQuery.isLoading ||
		topPathsQuery.isLoading ||
		topCompaniesQuery.isLoading;

	const isError =
		overviewQuery.isError ||
		topPathsQuery.isError ||
		topCompaniesQuery.isError;

	const maxPathCount = Math.max(
		...topPaths.map((item) => item.count),
		1,
	);

	const maxCompanyCount = Math.max(
		...topCompanies.map((item) => item.count),
		1,
	);

	if (isLoading) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="text-center">
					<Activity className="mx-auto size-8 animate-pulse text-primary" />

					<p className="mt-3 text-sm font-semibold text-foreground">
						Carregando métricas...
					</p>

					<p className="mt-1 text-xs text-muted">
						Buscando dados do backend.
					</p>
				</div>
			</div>
		);
	}

	if (isError || !overview) {
		return (
			<ContentCard className="p-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
						<Activity className="size-5" />
					</div>

					<div>
						<h2 className="font-semibold text-foreground">
							Não foi possível carregar as métricas
						</h2>

						<p className="mt-1 text-sm text-muted">
							Verifique se o backend está disponível e se o usuário
							possui permissão de administrador.
						</p>
					</div>
				</div>
			</ContentCard>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-primary">
						Analytics
					</p>

					<h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
						Métricas do sistema
					</h1>

					<p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
						Acompanhe o uso da plataforma, visitantes e as rotas
						mais utilizadas.
					</p>
				</div>

				<button
					type="button"
					onClick={() => {
						overviewQuery.refetch();
						topPathsQuery.refetch();
						topCompaniesQuery.refetch();
					}}
					className="inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-card"
				>
					<RefreshCw className="size-4" />

					Atualizar
				</button>
			</div>

			{/* Overview */}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Requisições"
					value={formatNumber(overview.totalRequests)}
					description="Total de requisições"
					icon={Activity}
				/>

				<MetricCard
					title="Usuários únicos"
					value={formatNumber(overview.uniqueUsers)}
					description="Usuários autenticados"
					icon={Users}
				/>

				<MetricCard
					title="Visitantes únicos"
					value={formatNumber(overview.uniqueAnonymous)}
					description="Visitantes anônimos"
					icon={Globe}
				/>

				<MetricCard
					title="Rotas monitoradas"
					value={formatNumber(topPaths.length)}
					description="Rotas no ranking atual"
					icon={Route}
				/>
			</div>

			{/* Requests by day */}
			<ContentCard className="p-5 sm:p-6">
				<div className="mb-6">
					<h2 className="text-lg font-bold text-foreground">
						Requisições por dia
					</h2>

					<p className="mt-1 text-sm text-muted">
						Volume de eventos registrados pelo backend no período
						selecionado.
					</p>
				</div>

				{overview.requestsByDay.length === 0 ? (
					<div className="py-10 text-center">
						<p className="text-sm text-muted">
							Nenhuma requisição registrada no período.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{overview.requestsByDay.map((item) => {
							const maxDay = Math.max(
								...overview.requestsByDay.map(
									(day) => day.count,
								),
								1,
							);

							const width =
								(item.count / maxDay) * 100;

							return (
								<div key={item.date}>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm font-medium text-foreground">
											{formatDate(item.date)}
										</span>

										<span className="text-sm font-bold text-foreground">
											{formatNumber(item.count)}
										</span>
									</div>

									<div className="h-2 overflow-hidden rounded-full bg-border">
										<div
											className="h-full rounded-full bg-primary"
											style={{
												width: `${width}%`,
											}}
										/>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</ContentCard>

			{/* Top paths + companies */}
			<div className="grid gap-6 xl:grid-cols-2">
				<ContentCard className="p-5 sm:p-6">
					<div className="mb-6 flex items-start gap-4">
						<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Route className="size-5" />
						</div>

						<div>
							<h2 className="text-lg font-bold text-foreground">
								Rotas mais utilizadas
							</h2>

							<p className="mt-1 text-sm text-muted">
								Top 10 endpoints por número de requisições.
							</p>
						</div>
					</div>

					{topPaths.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted">
							Nenhuma rota encontrada.
						</p>
					) : (
						<div className="space-y-5">
							{topPaths.map((item, index) => {
								const width =
									(item.count / maxPathCount) * 100;

								return (
									<div
										key={`${item.path}-${index}`}
									>
										<div className="mb-2 flex items-center justify-between gap-3">
											<div className="flex min-w-0 items-center gap-3">
												<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-card text-xs font-bold text-muted">
													{index + 1}
												</span>

												<span className="truncate text-sm font-medium text-foreground">
													{item.path}
												</span>
											</div>

											<span className="shrink-0 text-sm font-bold text-foreground">
												{formatNumber(item.count)}
											</span>
										</div>

										<div className="ml-10 h-2 overflow-hidden rounded-full bg-border">
											<div
												className="h-full rounded-full bg-primary"
												style={{
													width: `${width}%`,
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</ContentCard>

				<ContentCard className="p-5 sm:p-6">
					<div className="mb-6 flex items-start gap-4">
						<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Building2 className="size-5" />
						</div>

						<div>
							<h2 className="text-lg font-bold text-foreground">
								Lojas com maior utilização
							</h2>

							<p className="mt-1 text-sm text-muted">
								Top 10 empresas por número de requisições.
							</p>
						</div>
					</div>

					{topCompanies.length === 0 ? (
						<p className="py-8 text-center text-sm text-muted">
							Nenhuma empresa encontrada.
						</p>
					) : (
						<div className="space-y-5">
							{topCompanies.map((item, index) => {
								const width =
									(item.count / maxCompanyCount) * 100;

								return (
									<div
										key={`${item.companyId}-${index}`}
									>
										<div className="mb-2 flex items-center justify-between gap-3">
											<div className="flex min-w-0 items-center gap-3">
												<span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-card text-xs font-bold text-muted">
													{index + 1}
												</span>

												<span className="truncate text-sm font-medium text-foreground">
													{item.companyId}
												</span>
											</div>

											<span className="shrink-0 text-sm font-bold text-foreground">
												{formatNumber(item.count)}
											</span>
										</div>

										<div className="ml-10 h-2 overflow-hidden rounded-full bg-border">
											<div
												className="h-full rounded-full bg-primary"
												style={{
													width: `${width}%`,
												}}
											/>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</ContentCard>
			</div>

		</div>
	);
}
