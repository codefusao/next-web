import { apiRequest } from "@/api/client";
import { companySchema } from "@/api/company/company-contract";
import type { Company } from "@/types/company";

export async function getCompany(companyId: string): Promise<Company> {
	return apiRequest(`/company/${companyId}`, companySchema);
}
