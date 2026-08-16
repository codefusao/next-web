import { apiRequest } from "@/api/client";
import { companySchema } from "@/api/company/company-contract";

export async function deleteCompany(companyId: string): Promise<string> {
	await apiRequest(`/company/${companyId}`, companySchema, {
		method: "DELETE",
	});
	return companyId;
}
