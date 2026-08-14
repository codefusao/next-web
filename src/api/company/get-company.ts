import { apiRequest } from "@/api/client";
import { companySchema } from "@/api/company/company-contract";
import { toCompanyListItem } from "@/api/company/to-company-list-item";
import type { CompanyListItem } from "@/types/company";

export async function getCompany(companyId: string): Promise<CompanyListItem> {
	const company = await apiRequest(`/company/${companyId}`, companySchema);
	return toCompanyListItem(company);
}
