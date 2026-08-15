import type { z } from "zod";
import { apiRequest } from "@/api/client";
import { companiesResponseSchema } from "@/api/company/company-contract";
import type { Company } from "@/types/company";

export const companyPageLimit = 10;

export type Companies = {
	companies: Company[];
	meta: z.infer<typeof companiesResponseSchema>["meta"];
};

export async function getCompanies(
	page: number,
	search: string,
	limit = companyPageLimit,
): Promise<Companies> {
	const searchParams = new URLSearchParams({
		page: String(page),
		limit: String(limit),
	});
	if (search.trim()) searchParams.set("search", search.trim());
	const response = await apiRequest(
		`/company?${searchParams.toString()}`,
		companiesResponseSchema,
	);

	return {
		companies: response.companies,
		meta: response.meta,
	};
}
