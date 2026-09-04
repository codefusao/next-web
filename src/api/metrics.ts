import { z } from "zod";
import { apiRequest } from "@/api/client";

import {
  mockMetricsOverview,
  mockTopCompanies,
  mockTopPaths,
} from "@/api/mock-metrics";

const requestsByDaySchema = z.object({
	date: z.string(),
	count: z.number(),
});

const metricsOverviewSchema = z.object({
	totalRequests: z.number(),
	uniqueUsers: z.number(),
	uniqueAnonymous: z.number(),
	requestsByDay: z.array(requestsByDaySchema),
});

const topPathSchema = z.object({
	path: z.string(),
	count: z.number(),
});

const topCompanySchema = z.object({
	companyId: z.string(),
	count: z.number(),
});

export type MetricsOverview = z.infer<typeof metricsOverviewSchema>;
export type TopPath = z.infer<typeof topPathSchema>;
export type TopCompany = z.infer<typeof topCompanySchema>;

export async function getMetricsOverview(params?: {
	from?: string;
	to?: string;
}) {
	const searchParams = new URLSearchParams();

	if (params?.from) {
		searchParams.set("from", params.from);
	}

	if (params?.to) {
		searchParams.set("to", params.to);
	}

	const query = searchParams.toString();

	return apiRequest(
		`/metrics/overview${query ? `?${query}` : ""}`,
		metricsOverviewSchema,
	);
}

export async function getTopPaths(params?: {
	from?: string;
	to?: string;
	limit?: number;
}) {
	const searchParams = new URLSearchParams();

	if (params?.from) {
		searchParams.set("from", params.from);
	}

	if (params?.to) {
		searchParams.set("to", params.to);
	}

	searchParams.set("limit", String(params?.limit ?? 10));

	const query = searchParams.toString();

	return apiRequest(
		`/metrics/top-paths?${query}`,
		z.array(topPathSchema),
	);
}

export async function getTopCompanies(params?: {
	from?: string;
	to?: string;
	limit?: number;
}) {
	const searchParams = new URLSearchParams();

	if (params?.from) {
		searchParams.set("from", params.from);
	}

	if (params?.to) {
		searchParams.set("to", params.to);
	}

	searchParams.set("limit", String(params?.limit ?? 10));

	const query = searchParams.toString();

	return apiRequest(
		`/metrics/top-companies?${query}`,
		z.array(topCompanySchema),
	);
}
