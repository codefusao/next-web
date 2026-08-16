import { apiRequest } from "@/api/client";
import {
	type CreateCompanyInput,
	companySchema,
} from "@/api/company/company-contract";
import type { Company } from "@/types/company";

export async function createCompany(
	input: CreateCompanyInput,
): Promise<Company> {
	return apiRequest("/company", companySchema, {
		method: "POST",
		body: input,
	});
}
