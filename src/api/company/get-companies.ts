import type { z } from "zod";
import { apiRequest } from "@/api/client";
import { companiesResponseSchema } from "@/api/company/company-contract";
import { toCompanyListItem } from "@/api/company/to-company-list-item";
import type { CompanyListItem } from "@/types/company";

export const companyPageLimit = 10;

export type Companies = {
	companies: CompanyListItem[];
	meta: z.infer<typeof companiesResponseSchema>["meta"];
};

export async function getCompanies(
	page: number,
	_query: string,
	limit = companyPageLimit,
): Promise<Companies> {
	// TODO(backend): send query once GET /company supports server-side search.
	const response = await apiRequest(
		`/company?page=${page}&limit=${limit}`,
		companiesResponseSchema,
	);

	return {
		companies: response.companies.map(toCompanyListItem),
		meta: response.meta,
	};
}
