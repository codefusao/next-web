import {
	ArrowDown,
	ChartNoAxesCombined,
	CreditCard,
	MapPin,
	Search,
	ShoppingBasket,
	TrendingDown,
	TrendingUp,
	PackageSearch,
	MousePointerClick,
	Sparkles,
	ShoppingCart,
} from "lucide-react";
import { ContentCard } from "@/components/ui/content-card";

type FunnelStep = {
	id: string;
	label: string;
	description: string;
	value: number;
	icon: typeof Search;
};

const funnelSteps: FunnelStep[] = [
	{
		id: "search",
		label: "Buscaram um produto",
		description: "Usuários que pesquisaram por algum produto no aplicativo",
		value: 12840,
		icon: Search,
	},
	{
		id: "store",
		label: "Foram até a loja",
		description: "Usuários que seguiram as orientações até uma loja",
		value: 7640,
		icon: MapPin,
	},
	{
		id: "product",
		label: "Encontraram o produto",
		description: "Usuários que localizaram e pegaram o produto",
		value: 6215,
		icon: ShoppingBasket,
	},
	{
		id: "checkout",
		label: "Pagaram no caixa",
		description: "Usuários que concluíram a compra",
		value: 4380,
		icon: CreditCard,
	},
];

const alternativeFunnelSteps = [
	{
		id: "not-found",
		label: 'Clicaram em "Não encontrei"',
		description: "Usuários que não encontraram o produto na localização indicada",
		value: 1425,
		icon: PackageSearch,
	},
	{
		id: "recommendations",
		label: "Receberam recomendações",
		description: "Usuários que visualizaram produtos similares recomendados",
		value: 1425,
		icon: Sparkles,
	},
	{
		id: "selected-product",
		label: "Selecionaram uma alternativa",
		description: "Usuários que escolheram um produto recomendado",
		value: 896,
		icon: MousePointerClick,
	},
	{
		id: "alternative-found",
		label: "Encontraram o produto alternativo",
		description: "Usuários que conseguiram localizar a nova recomendação",
		value: 721,
		icon: ShoppingBasket,
	},
	{
		id: "alternative-checkout",
		label: "Finalizaram a compra",
		description: "Usuários que pagaram por um produto recomendado",
		value: 584,
		icon: ShoppingCart,
	},
];

function formatNumber(value: number) {
	return new Intl.NumberFormat("pt-BR").format(value);
}

function getConversion(currentValue: number, previousValue: number) {
	return Math.round((currentValue / previousValue) * 100);
}

function getAlternativeConversion() {
	const firstStep = alternativeFunnelSteps[0].value;
	const lastStep =
		alternativeFunnelSteps[alternativeFunnelSteps.length - 1].value;

	return Math.round((lastStep / firstStep) * 100);
}

function getDropOff(currentValue: number, previousValue: number) {
	return previousValue - currentValue;
}

function getTotalConversion() {
	const firstStep = funnelSteps[0].value;
	const lastStep = funnelSteps[funnelSteps.length - 1].value;

	return Math.round((lastStep / firstStep) * 100);
}

export function FunnelMetrics() {
	const totalConversion = getTotalConversion();

	const dropOffs = funnelSteps.slice(1).map((step, index) => {
		const previousStep = funnelSteps[index];
		const dropOff = getDropOff(step.value, previousStep.value);

		return {
			label: `${previousStep.label} → ${step.label}`,
			value: dropOff,
			percentage: Math.round((dropOff / previousStep.value) * 100),
		};
	});

	const biggestDropOff = dropOffs.reduce((previous, current) =>
		current.value > previous.value ? current : previous,
	);

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
					trend="Positivo"
				/>

				<MetricCard
					title="Compras concluídas"
					value={formatNumber(funnelSteps[3].value)}
					description="Usuários chegaram ao caixa"
					icon={CreditCard}
				/>

				<MetricCard
					title="Maior abandono"
					value={`${biggestDropOff.percentage}%`}
					description="Entre busca e visita à loja"
					icon={TrendingDown}
					trend="Atenção"
					variant="destructive"
				/>

				<MetricCard
					title="Tempo médio"
					value="18 min"
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

				<div className="space-y-3">
					{funnelSteps.map((step, index) => {
						const Icon = step.icon;
						const previousStep = funnelSteps[index - 1];
						const conversion =
							index === 0
								? 100
								: getConversion(step.value, previousStep.value);

						const width = Math.max(
							35,
							Math.round((step.value / funnelSteps[0].value) * 100),
						);

						return (
							<div key={step.id}>
								{index > 0 ? (
									<div className="flex items-center gap-3 py-2 pl-7 sm:pl-10">
										<div className="flex items-center gap-2 text-xs font-semibold text-muted">
											<ArrowDown className="size-4 text-primary" />

											<span>
												{conversion}% avançaram para esta etapa
											</span>
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

											<p className="text-xs font-medium text-muted">
												usuários
											</p>
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

										<span>{width}% do volume inicial</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
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
									{biggestDropOff.label}
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
								Há oportunidade na navegação até a loja
							</h2>

							<p className="mt-2 text-sm leading-6 text-muted">
								Quase 41% dos usuários que buscam um produto não chegam à
								loja. Melhorar as instruções de localização pode aumentar a
								conversão do funil.
							</p>
						</div>
					</div>
				</ContentCard>
			</div>

            <div className="border-t border-border pt-10">
	            <AlternativeFunnel />
            </div>

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

export function AlternativeFunnel() {
	const totalConversion = getAlternativeConversion();

	const biggestDropOff = alternativeFunnelSteps
		.slice(1)
		.map((step, index) => {
			const previousStep = alternativeFunnelSteps[index];
			const dropOff = previousStep.value - step.value;

			return {
				from: previousStep.label,
				to: step.label,
				value: dropOff,
				percentage: Math.round(
					(dropOff / previousStep.value) * 100,
				),
			};
		})
		.reduce((previous, current) =>
			current.value > previous.value ? current : previous,
		);

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
					Acompanhe o comportamento do usuário quando ele não encontra o
					produto e utiliza as recomendações de produtos similares.
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
					value={formatNumber(
						alternativeFunnelSteps[
							alternativeFunnelSteps.length - 1
						].value,
					)}
					description="Compras realizadas após recomendação"
					icon={ShoppingCart}
				/>

				<MetricCard
					title="Maior abandono"
					value={`${biggestDropOff.percentage}%`}
					description="Durante a escolha da alternativa"
					icon={TrendingDown}
					trend="Atenção"
					variant="destructive"
				/>

				<MetricCard
					title="Tempo de recuperação"
					value="6 min"
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

				<div className="space-y-3">
					{alternativeFunnelSteps.map((step, index) => {
						const Icon = step.icon;
						const previousStep = alternativeFunnelSteps[index - 1];

						const conversion =
							index === 0
								? 100
								: getConversion(
										step.value,
										previousStep.value,
									);

						const width = Math.max(
							35,
							Math.round(
								(step.value /
									alternativeFunnelSteps[0].value) *
									100,
							),
						);

						return (
							<div key={step.id}>
								{index > 0 ? (
									<div className="flex items-center gap-3 py-2 pl-7 sm:pl-10">
										<div className="flex items-center gap-2 text-xs font-semibold text-muted">
											<ArrowDown className="size-4 text-primary" />

											<span>
												{conversion}% avançaram para esta etapa
											</span>
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

											<p className="text-xs font-medium text-muted">
												usuários
											</p>
										</div>
									</div>

									<div className="h-3 overflow-hidden rounded-full bg-border">
										<div
											className="h-full rounded-full bg-primary"
											style={{
												width: `${width}%`,
											}}
										/>
									</div>

									<div className="mt-2 flex justify-between text-xs text-muted">
										<span>
											{conversion}% de conversão
										</span>

										<span>
											{width}% do fluxo iniciado
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
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
								{formatNumber(
									alternativeFunnelSteps[
										alternativeFunnelSteps.length - 1
									].value,
								)}{" "}
								compras recuperadas
							</h2>

							<p className="mt-2 text-sm leading-6 text-muted">
								Usuários que não encontrariam o produto original
								conseguiram concluir uma compra utilizando produtos
								similares recomendados pelo aplicativo.
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
								{biggestDropOff.percentage}% abandonam a escolha
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
								. Melhorar a relevância das recomendações pode
								recuperar mais vendas.
							</p>
						</div>
					</div>
				</ContentCard>
			</div>
		</div>
	);
}
