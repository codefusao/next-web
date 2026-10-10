"use client";

import {
	Activity,
	ArrowDown,
	ChartNoAxesCombined,
	CreditCard,
	MapPin,
	MousePointerClick,
	PackageSearch,
	Search,
	ShoppingBasket,
	ShoppingCart,
	Sparkles,
	TrendingDown,
	TrendingUp,
} from "lucide-react";

import type {
	FunnelMetrics as FunnelMetricsData,
	JourneyStepType,
	RecoveryStepType,
} from "@/api/metrics";
import { ContentCard } from "@/components/ui/content-card";
import { useFunnelMetricsQuery } from "@/hooks/use-metrics-query";

type StepMeta = {
	label: string;
	description: string;
	icon: typeof Search;
};

type FunnelStep = StepMeta & {
	id: string;
	value: number;
};

const journeyStepMeta: Record<JourneyStepType, StepMeta> = {
	PRODUCT_SEARCHED: {
		label: "Buscaram um produto",
		description: "Usuários que pesquisaram por algum produto no aplicativo",
		icon: Search,
	},
	STORE_VISITED: {
		label: "Foram até a loja",
		description: "Usuários que seguiram as orientações até uma loja",
		icon: MapPin,
	},
	PRODUCT_FOUND: {
		label: "Encontraram o produto",
		description: "Usuários que localizaram e pegaram o produto",
		icon: ShoppingBasket,
	},
	CHECKOUT_COMPLETED: {
		label: "Pagaram no caixa",
		description: "Usuários que concluíram a compra",
		icon: CreditCard,
	},
};

const recoveryStepMeta: Record<RecoveryStepType, StepMeta> = {
	PRODUCT_NOT_FOUND: {
		label: 'Clicaram em "Não encontrei"',
		description:
			"Usuários que não encontraram o produto na localização indicada",
		icon: PackageSearch,
	},
	RECOMMENDATIONS_VIEWED: {
		label: "Receberam recomendações",
		description: "Usuários que visualizaram produtos similares recomendados",
		icon: Sparkles,
	},
	ALTERNATIVE_SELECTED: {
		label: "Selecionaram uma alternativa",
		description: "Usuários que escolheram um produto recomendado",
		icon: MousePointerClick,
	},
	ALTERNATIVE_FOUND: {
		label: "Encontraram o produto alternativo",
		description: "Usuários que conseguiram localizar a nova recomendação",
		icon: ShoppingBasket,
	},
	ALTERNATIVE_CHECKOUT_COMPLETED: {
		label: "Finalizaram a compra",
		description: "Usuários que pagaram por um produto recomendado",
		icon: ShoppingCart,
	},
};

function toSteps<T extends string>(
	steps: { type: T; count: number }[],
	meta: Record<T, StepMeta>,
): FunnelStep[] {
	return steps.map((step) => ({
		id: step.type,
		value: step.count,
		...meta[step.type],
	}));
}

function formatNumber(value: number) {
	return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDuration(seconds: number | null) {
	if (seconds === null) {
		return "—";
	}

	if (seconds < 60) {
		return `${seconds} s`;
	}

	return `${Math.round(seconds / 60)} min`;
}

function percentage(value: number, total: number) {
	return total > 0 ? Math.round((value / total) * 100) : 0;
}

function getBiggestDropOff(steps: FunnelStep[]) {
	return steps
		.slice(1)
		.map((step, index) => {
			const previousStep = steps[index];
			const dropOff = Math.max(previousStep.value - step.value, 0);

			return {
				from: previousStep.label,
				to: step.label,
				value: dropOff,
				percentage: percentage(dropOff, previousStep.value),
			};
		})
		.reduce((previous, current) =>
			current.percentage > previous.percentage ? current : previous,
		);
}

export function FunnelMetrics() {
	const funnelQuery = useFunnelMetricsQuery();

	if (funnelQuery.isLoading) {
		return (
			<div className="flex min-h-[300px] items-center justify-center">
				<div className="text-center">
					<Activity className="mx-auto size-8 animate-pulse text-primary" />

					<p className="mt-3 text-sm font-semibold text-foreground">
						Carregando funil...
					</p>
				</div>
			</div>
		);
	}

	if (funnelQuery.isError || !funnelQuery.data) {
		return (
			<ContentCard className="p-6">
				<div className="flex items-start gap-4">
					<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
						<Activity className="size-5" />
					</div>

					<div>
						<h2 className="font-semibold text-foreground">
							Não foi possível carregar o funil
						</h2>

						<p className="mt-1 text-sm text-muted">
							Verifique se o backend está disponível e se o usuário possui
							permissão de administrador.
						</p>
					</div>
				</div>
			</ContentCard>
		);
	}

	return <JourneyFunnel data={funnelQuery.data} />;
}

function JourneyFunnel({ data }: { data: FunnelMetricsData }) {
	const funnelSteps = toSteps(data.journey.steps, journeyStepMeta);
	const firstStep = funnelSteps[0];
	const lastStep = funnelSteps[funnelSteps.length - 1];
	const totalConversion = percentage(lastStep.value, firstStep.value);
	const biggestDropOff = getBiggestDropOff(funnelSteps);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-wide text-primary">
					Analytics
				</p>

				<h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
					Métricas do funil
				</h1>

				<p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
					Acompanhe a jornada do cliente desde a busca por um produto até a
					finalização da compra no caixa.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Conversão total"
					value={`${totalConversion}%`}
					description="Da busca até o pagamento"
					icon={TrendingUp}
				/>

				<MetricCard
					title="Compras concluídas"
					value={formatNumber(lastStep.value)}
					description="Usuários chegaram ao caixa"
					icon={CreditCard}
				/>

				<MetricCard
					title="Maior abandono"
					value={`${biggestDropOff.percentage}%`}
					description={`${biggestDropOff.from} → ${biggestDropOff.to}`}
					icon={TrendingDown}
					trend="Atenção"
					variant="destructive"
				/>

				<MetricCard
					title="Tempo médio"
					value={formatDuration(data.journey.averageDurationSeconds)}
					description="Da busca até a compra"
					icon={ChartNoAxesCombined}
				/>
			</div>

			<ContentCard className="overflow-hidden p-5 sm:p-6">
				<div className="mb-8 flex flex-col gap-2">
					<h2 className="text-lg font-bold text-foreground">
						Jornada do usuário
					</h2>

					<p className="text-sm text-muted">
						Acompanhe quantos usuários avançam em cada etapa do funil.
					</p>
				</div>

				<FunnelStepList steps={funnelSteps} volumeLabel="do volume inicial" />
			</ContentCard>

			<div className="grid gap-6 lg:grid-cols-2">
				<ContentCard className="p-5 sm:p-6">
					<div className="flex items-start gap-4">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
							<TrendingDown className="size-6" />
						</div>

						<div>
							<p className="text-sm font-semibold text-muted">
								Maior ponto de abandono
							</p>

							<h2 className="mt-1 text-xl font-bold text-foreground">
								{biggestDropOff.percentage}% dos usuários
							</h2>

							<p className="mt-2 text-sm leading-6 text-muted">
								{formatNumber(biggestDropOff.value)} usuários abandonaram a
								jornada entre{" "}
								<span className="font-semibold text-foreground">
									{biggestDropOff.from} → {biggestDropOff.to}
								</span>
								.
							</p>
						</div>
					</div>
				</ContentCard>

				<ContentCard className="p-5 sm:p-6">
					<div className="flex items-start gap-4">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<TrendingUp className="size-6" />
						</div>

						<div>
							<p className="text-sm font-semibold text-muted">
								Insight principal
							</p>

							<h2 className="mt-1 text-xl font-bold text-foreground">
								Há oportunidade na etapa &quot;{biggestDropOff.to}&quot;
							</h2>

							<p className="mt-2 text-sm leading-6 text-muted">
								{biggestDropOff.percentage}% dos usuários que{" "}
								{biggestDropOff.from.toLowerCase()} não avançam para a etapa
								seguinte. Melhorar essa etapa da jornada pode aumentar a
								conversão do funil.
							</p>
						</div>
					</div>
				</ContentCard>
			</div>

			<div className="border-t border-border pt-10">
				<AlternativeFunnel data={data} />
			</div>
		</div>
	);
}

function FunnelStepList({
	steps,
	volumeLabel,
}: {
	steps: FunnelStep[];
	volumeLabel: string;
}) {
	const initialValue = steps[0].value;

	return (
		<div className="space-y-3">
			{steps.map((step, index) => {
				const Icon = step.icon;
				const previousStep = steps[index - 1];
				const conversion =
					index === 0 ? 100 : percentage(step.value, previousStep.value);
				const volume = percentage(step.value, initialValue);
				const width = Math.max(35, volume);

				return (
					<div key={step.id}>
						{index > 0 ? (
							<div className="flex items-center gap-3 py-2 pl-7 sm:pl-10">
								<div className="flex items-center gap-2 text-xs font-semibold text-muted">
									<ArrowDown className="size-4 text-primary" />

									<span>{conversion}% avançaram para esta etapa</span>
								</div>
							</div>
						) : null}

						<div className="rounded-[var(--radius-control)] border border-border bg-background p-4 sm:p-5">
							<div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-start gap-3">
									<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
										<Icon className="size-5" />
									</div>

									<div>
										<p className="font-semibold text-foreground">
											{step.label}
										</p>

										<p className="mt-1 text-sm text-muted">
											{step.description}
										</p>
									</div>
								</div>

								<div className="sm:text-right">
									<p className="text-2xl font-bold text-foreground">
										{formatNumber(step.value)}
									</p>

									<p className="text-xs font-medium text-muted">usuários</p>
								</div>
							</div>

							<div className="h-3 overflow-hidden rounded-full bg-border">
								<div
									className="h-full rounded-full bg-primary transition-all"
									style={{ width: `${width}%` }}
								/>
							</div>

							<div className="mt-2 flex justify-between text-xs text-muted">
								<span>{conversion}% de conversão</span>

								<span>
									{volume}% {volumeLabel}
								</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

type MetricCardProps = {
	title: string;
	value: string;
	description: string;
	icon: typeof TrendingUp;
	trend?: string;
	variant?: "default" | "destructive";
};

function MetricCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	variant = "default",
}: MetricCardProps) {
	const iconClass =
		variant === "destructive"
			? "bg-destructive/10 text-destructive"
			: "bg-primary/10 text-primary";

	return (
		<ContentCard className="p-5">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-muted">{title}</p>

					<p className="mt-2 text-2xl font-bold text-foreground">{value}</p>

					<p className="mt-1 text-xs text-muted">{description}</p>

					{trend ? (
						<span
							className={`mt-3 inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-semibold ${
								variant === "destructive"
									? "bg-destructive/10 text-destructive"
									: "bg-primary/10 text-primary"
							}`}
						>
							{trend}
						</span>
					) : null}
				</div>

				<div
					className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
				>
					<Icon className="size-5" />
				</div>
			</div>
		</ContentCard>
	);
}

export function AlternativeFunnel({ data }: { data: FunnelMetricsData }) {
	const alternativeFunnelSteps = toSteps(data.recovery.steps, recoveryStepMeta);
	const firstStep = alternativeFunnelSteps[0];
	const lastStep = alternativeFunnelSteps[alternativeFunnelSteps.length - 1];
	const totalConversion = percentage(lastStep.value, firstStep.value);
	const biggestDropOff = getBiggestDropOff(alternativeFunnelSteps);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold uppercase tracking-wide text-primary">
					Fluxo alternativo
				</p>

				<h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
					Produto não encontrado
				</h2>

				<p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
					Acompanhe o comportamento do usuário quando ele não encontra o produto
					e utiliza as recomendações de produtos similares.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					title="Conversão alternativa"
					value={`${totalConversion}%`}
					description='Do "Não encontrei" até a compra'
					icon={TrendingUp}
					trend="Recuperação"
				/>

				<MetricCard
					title="Compras recuperadas"
					value={formatNumber(lastStep.value)}
					description="Compras realizadas após recomendação"
					icon={ShoppingCart}
				/>

				<MetricCard
					title="Maior abandono"
					value={`${biggestDropOff.percentage}%`}
					description={`${biggestDropOff.from} → ${biggestDropOff.to}`}
					icon={TrendingDown}
					trend="Atenção"
					variant="destructive"
				/>

				<MetricCard
					title="Tempo de recuperação"
					value={formatDuration(data.recovery.averageDurationSeconds)}
					description="Até finalizar a compra alternativa"
					icon={ChartNoAxesCombined}
				/>
			</div>

			<ContentCard className="overflow-hidden p-5 sm:p-6">
				<div className="mb-8">
					<h2 className="text-lg font-bold text-foreground">
						Funil de recuperação
					</h2>

					<p className="mt-1 text-sm text-muted">
						Jornada iniciada quando o usuário informa que não encontrou o
						produto procurado.
					</p>
				</div>

				<FunnelStepList
					steps={alternativeFunnelSteps}
					volumeLabel="do fluxo iniciado"
				/>
			</ContentCard>

			<div className="grid gap-6 lg:grid-cols-2">
				<ContentCard className="p-5 sm:p-6">
					<div className="flex items-start gap-4">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
							<Sparkles className="size-6" />
						</div>

						<div>
							<p className="text-sm font-semibold text-muted">
								Impacto das recomendações
							</p>

							<h2 className="mt-1 text-xl font-bold text-foreground">
								{formatNumber(lastStep.value)} compras recuperadas
							</h2>

							<p className="mt-2 text-sm leading-6 text-muted">
								Usuários que não encontrariam o produto original conseguiram
								concluir uma compra utilizando produtos similares recomendados
								pelo aplicativo.
							</p>
						</div>
					</div>
				</ContentCard>

				<ContentCard className="p-5 sm:p-6">
					<div className="flex items-start gap-4">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
							<TrendingDown className="size-6" />
						</div>

						<div>
							<p className="text-sm font-semibold text-muted">
								Oportunidade de melhoria
							</p>

							<h2 className="mt-1 text-xl font-bold text-foreground">
								{biggestDropOff.percentage}% abandonam nesta etapa
							</h2>

							<p className="mt-2 text-sm leading-6 text-muted">
								O maior abandono acontece entre{" "}
								<span className="font-semibold text-foreground">
									{biggestDropOff.from}
								</span>{" "}
								e{" "}
								<span className="font-semibold text-foreground">
									{biggestDropOff.to}
								</span>
								. Melhorar a relevância das recomendações pode recuperar mais
								vendas.
							</p>
						</div>
					</div>
				</ContentCard>
			</div>
		</div>
	);
}
