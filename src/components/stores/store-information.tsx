import { Building2, FileText, GitBranch, MapPin } from "lucide-react";
import type { StoreListItem } from "@/types/store";

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

type StoreInformationProps = {
	store: StoreListItem;
};

export function StoreInformation({ store }: StoreInformationProps) {
	return (
		<section className="mt-6" aria-labelledby="store-information-title">
			<h2 id="store-information-title" className="text-xl font-bold">
				Informações da loja
			</h2>
			<div className="mt-4 grid gap-4 md:grid-cols-2">
				<DetailItem label="Nome da loja">{store.name}</DetailItem>
				{store.address ? (
					<DetailItem label="Endereço">
						<span className="flex items-start gap-2">
							<MapPin
								aria-hidden="true"
								className="mt-1 size-4 shrink-0 text-primary"
							/>
							{store.address}
						</span>
					</DetailItem>
				) : null}
				{store.cnpj ? (
					<DetailItem label="CNPJ">
						<span className="flex items-center gap-2">
							<Building2
								aria-hidden="true"
								className="size-4 shrink-0 text-muted"
							/>
							{store.cnpj}
						</span>
					</DetailItem>
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
		</section>
	);
}
