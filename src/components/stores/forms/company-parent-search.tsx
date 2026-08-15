"use client";

import { Building2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { useCompaniesQuery } from "@/hooks/use-companies-query";
import type { CompanyListItem } from "@/types/company";

type CompanyParentSearchProps = {
	companyId?: string;
	error?: string;
	inputId: string;
	onSelectedCompanyIdChange: (companyId: string) => void;
};

export function CompanyParentSearch({
	companyId,
	error,
	inputId,
	onSelectedCompanyIdChange,
}: CompanyParentSearchProps) {
	const [query, setQuery] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [selectedCompany, setSelectedCompany] =
		useState<CompanyListItem | null>(null);
	const { data, isFetching } = useCompaniesQuery(1, query);
	const companies = (data?.companies ?? []).filter(
		(company) => company.id !== companyId,
	);

	return (
		<FormField
			label="Buscar empresa matriz (opcional)"
			inputId={inputId}
			error={error}
		>
			<div className="relative">
				<SearchInput
					query={query}
					onQueryChange={setQuery}
					placeholder="Buscar empresa matriz"
					label="Buscar empresa matriz"
					inputId={inputId}
					onFocus={() => setIsSearchFocused(true)}
					onBlur={() => setIsSearchFocused(false)}
					className="mb-0"
					variant="form"
				/>
				{isSearchFocused ? (
					<div className="absolute inset-x-0 top-[calc(var(--control-height-input)+0.5rem)] z-20 max-h-44 overflow-y-auto rounded-[var(--radius-control)] border border-border bg-card shadow-lg">
						{isFetching ? (
							<p className="px-3 py-2 text-sm text-muted">
								Buscando empresas...
							</p>
						) : companies.length === 0 ? (
							<p className="px-3 py-2 text-sm text-muted">
								Nenhuma empresa disponível.
							</p>
						) : (
							<ul>
								{companies.map((company) => (
									<li key={company.id}>
										<button
											type="button"
											onMouseDown={(event) => event.preventDefault()}
											onClick={() => {
												setSelectedCompany(company);
												onSelectedCompanyIdChange(company.id);
												setIsSearchFocused(false);
											}}
											className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
										>
											<Building2
												aria-hidden="true"
												className="size-4 shrink-0 text-primary"
											/>
											<span className="truncate font-medium">
												{company.name}
											</span>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				) : null}
			</div>
			{selectedCompany ? (
				<div className="mt-2 flex items-center justify-between gap-3 rounded-[var(--radius-control)] border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
					<span className="flex min-w-0 items-center gap-2 font-medium text-foreground">
						<Building2
							aria-hidden="true"
							className="size-4 shrink-0 text-primary"
						/>
						<span className="truncate">{selectedCompany.name}</span>
					</span>
					<Button
						size="icon-sm"
						variant="ghost"
						onClick={() => {
							setSelectedCompany(null);
							onSelectedCompanyIdChange("");
						}}
						aria-label="Remover empresa matriz"
					>
						<X aria-hidden="true" className="size-4" />
					</Button>
				</div>
			) : null}
		</FormField>
	);
}
