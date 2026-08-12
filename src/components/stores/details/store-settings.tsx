import { ImageUp, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { storeStatusLabels, storeTypeLabels } from "@/constants/store";
import type { StoreListItem } from "@/types/store";

type StoreSettingsProps = {
	store: StoreListItem;
	onEdit: () => void;
	onChangeBanner: () => void;
	onDelete: () => void;
};

export function StoreSettings({
	store,
	onEdit,
	onChangeBanner,
	onDelete,
}: StoreSettingsProps) {
	const storeInformation = [
		{ label: "Nome da loja", value: store.name },
		{ label: "CNPJ", value: store.cnpj },
		{ label: "Telefone", value: store.phone },
		{ label: "E-mail", value: store.email },
		{ label: "Endereço", value: store.address },
		{
			label: "Área da loja",
			value: `${store.area.toLocaleString("pt-BR")} m²`,
		},
		{ label: "Gerente responsável", value: store.manager },
		{ label: "Tipo de loja", value: storeTypeLabels[store.type] },
		{ label: "Status da loja", value: storeStatusLabels[store.status] },
	];

	return (
		<div className="mt-6 space-y-5">
			<section
				aria-labelledby="store-information-title"
				className="rounded-[var(--radius-card)] border border-border bg-card p-5 sm:p-6"
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h2 id="store-information-title" className="text-lg font-bold">
							Informações da loja
						</h2>
						<p className="mt-1 text-sm text-muted">
							Gerencie os dados principais da sua loja.
						</p>
					</div>
					<Button variant="outline" size="compact" onClick={onEdit}>
						<Pencil aria-hidden="true" className="size-4" />
						Editar
					</Button>
				</div>
				<dl className="mt-6 divide-y divide-border overflow-hidden rounded-[var(--radius-control)] border border-border">
					{storeInformation.map(({ label, value }) => (
						<div
							key={label}
							className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[minmax(10rem,32%)_1fr] sm:gap-6"
						>
							<dt className="font-medium text-muted">{label}</dt>
							<dd
								className={
									label === "Status da loja"
										? "font-semibold text-primary"
										: "whitespace-pre-line font-medium text-foreground"
								}
							>
								{value}
							</dd>
						</div>
					))}
				</dl>
			</section>

			<section
				aria-labelledby="store-banner-title"
				className="rounded-[var(--radius-card)] border border-border bg-card p-5 sm:p-6"
			>
				<h2 id="store-banner-title" className="text-lg font-bold">
					Banner da loja
				</h2>
				<p className="mt-1 text-sm text-muted">
					Esta imagem é exibida no cabeçalho da loja.
				</p>
				<div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative h-28 w-full overflow-hidden rounded-[var(--radius-control)] sm:w-56">
						<Image
							src={store.bannerUrl}
							alt={`Banner da loja ${store.name}`}
							fill
							sizes="224px"
							className="object-cover"
						/>
					</div>
					<Button variant="outline" size="compact" onClick={onChangeBanner}>
						<ImageUp aria-hidden="true" className="size-4" />
						Alterar banner
					</Button>
				</div>
			</section>

			<section
				aria-labelledby="delete-store-title"
				className="rounded-[var(--radius-card)] border border-destructive/30 bg-destructive/5 p-5 sm:p-6"
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2
							id="delete-store-title"
							className="text-lg font-bold text-foreground"
						>
							Excluir loja
						</h2>
						<p className="mt-1 text-sm text-muted">
							Remova permanentemente esta loja e seu estoque associado.
						</p>
					</div>
					<Button
						variant="outline"
						size="compact"
						onClick={onDelete}
						className="border-destructive text-destructive hover:bg-destructive/10 focus-visible:outline-destructive"
					>
						<Trash2 aria-hidden="true" className="size-4" />
						Excluir loja
					</Button>
				</div>
			</section>
		</div>
	);
}
