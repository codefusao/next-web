"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	CreateCompanyInput,
	UpdateCompanyInput,
} from "@/api/company/company-contract";
import { createCompany } from "@/api/company/create-company";
import { deleteCompany } from "@/api/company/delete-company";
import {
	type Companies,
	companyPageLimit,
	getCompanies,
} from "@/api/company/get-companies";
import { getCompany } from "@/api/company/get-company";
import { updateCompany } from "@/api/company/update-company";
import { queryKeys } from "@/api/query-keys";
import type { CompanyFields } from "@/schemas/company";
import type { CompanyListItem } from "@/types/company";

export function useCompaniesQuery(
	page: number,
	query: string,
	limit = companyPageLimit,
) {
	return useQuery({
		queryKey: queryKeys.companies.list(page, limit, query),
		queryFn: () => getCompanies(page, query, limit),
	});
}

export function useCompanyQuery(companyId: string) {
	return useQuery({
		queryKey: queryKeys.companies.byId(companyId),
		queryFn: () => getCompany(companyId),
		enabled: Boolean(companyId),
	});
}

export function useCreateCompanyMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CompanyFields) =>
			createCompany(input satisfies CreateCompanyInput),
		onSuccess: (company) => {
			queryClient.setQueryData(queryKeys.companies.byId(company.id), company);
			queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
		},
	});
}

type UpdateCompanyVariables = {
	company: CompanyListItem;
	changes: UpdateCompanyInput;
};

export function useUpdateCompanyMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ company, changes }: UpdateCompanyVariables) =>
			updateCompany(company, changes),
		onSuccess: (updatedCompany) => {
			queryClient.setQueriesData<Companies>(
				{ queryKey: queryKeys.companies.lists },
				(page) =>
					page
						? {
								...page,
								companies: page.companies.map((company) =>
									company.id === updatedCompany.id ? updatedCompany : company,
								),
							}
						: page,
			);
			queryClient.setQueryData(
				queryKeys.companies.byId(updatedCompany.id),
				updatedCompany,
			);
		},
	});
}

export function useDeleteCompanyMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCompany,
		onSuccess: (companyId) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
			queryClient.removeQueries({
				queryKey: queryKeys.companies.byId(companyId),
			});
			queryClient.removeQueries({
				queryKey: queryKeys.companies.inventory(companyId),
			});
			queryClient.removeQueries({
				queryKey: queryKeys.companies.catalog(companyId),
			});
			queryClient.removeQueries({
				queryKey: queryKeys.companies.storeMap(companyId),
			});
		},
	});
}
