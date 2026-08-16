"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentSession, login, logout } from "@/api/auth";
import { queryKeys } from "@/api/query-keys";
import type { LoginFields } from "@/schemas/auth";
import { useAuthStore } from "@/store/auth-store";

export function useLoginMutation() {
	const setSession = useAuthStore((state) => state.login);

	return useMutation({
		mutationFn: (fields: LoginFields) => login(fields),
		onSuccess: (user) => setSession(user),
	});
}

export function useCurrentSessionQuery() {
	return useQuery({
		queryKey: queryKeys.auth.currentSession,
		queryFn: getCurrentSession,
		retry: false,
	});
}

export function useLogoutMutation() {
	return useMutation({ mutationFn: logout });
}
