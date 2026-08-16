"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/api/notifications";
import { queryKeys } from "@/api/query-keys";

export function useNotificationsQuery(companyId: string, page: number) {
	return useQuery({
		queryKey: queryKeys.companies.notifications(companyId, page),
		queryFn: () => getNotifications(companyId, page),
		enabled: Boolean(companyId),
		staleTime: 30_000,
	});
}
