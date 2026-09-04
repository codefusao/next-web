"use client";

import { useQuery } from "@tanstack/react-query";

import {
	getMetricsOverview,
	getTopCompanies,
	getTopPaths,
} from "@/api/metrics";

export function useMetricsOverviewQuery(params?: {
	from?: string;
	to?: string;
}) {
	return useQuery({
		queryKey: ["metrics", "overview", params],
		queryFn: () => getMetricsOverview(params),
	});
}

export function useTopPathsQuery(params?: {
	from?: string;
	to?: string;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["metrics", "top-paths", params],
		queryFn: () => getTopPaths(params),
	});
}

export function useTopCompaniesQuery(params?: {
	from?: string;
	to?: string;
	limit?: number;
}) {
	return useQuery({
		queryKey: ["metrics", "top-companies", params],
		queryFn: () => getTopCompanies(params),
	});
}
