"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDepartment, getDepartments } from "@/api/departments";

const departmentKey = (companyId: string) => ["departments", companyId] as const;

export function useDepartmentsQuery(companyId: string) {
	return useQuery({ queryKey: departmentKey(companyId), queryFn: () => getDepartments(companyId), staleTime: 30_000 });
}

export function useCreateDepartmentMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ companyId, name }: { companyId: string; name: string }) => createDepartment(companyId, name),
		onSuccess: (_, { companyId }) => queryClient.invalidateQueries({ queryKey: departmentKey(companyId) }),
	});
}
