import { apiRequest } from "@/api/client";
import {
	type CreateCompanyInput,
	companySchema,
} from "@/api/company/company-contract";
import { toCompanyListItem } from "@/api/company/to-company-list-item";
import type { CompanyListItem } from "@/types/company";

export async function createCompany(
	input: CreateCompanyInput,
): Promise<CompanyListItem> {
	const company = await apiRequest("/company", companySchema, {
		method: "POST",
		body: input,
	});
	return toCompanyListItem(company);
}
