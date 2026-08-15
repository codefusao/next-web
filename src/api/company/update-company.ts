import { apiRequest } from "@/api/client";
import {
	companySchema,
	type UpdateCompanyInput,
} from "@/api/company/company-contract";
import type { Company } from "@/types/company";

export async function updateCompany(
	company: Company,
	updatedCompany: UpdateCompanyInput,
): Promise<Company> {
	return apiRequest(`/company/${company.id}`, companySchema, {
		method: "PUT",
		body: updatedCompany,
	});
}
