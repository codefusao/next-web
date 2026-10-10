import { z } from "zod";
import { apiRequest } from "@/api/client";

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
	companyName: z.string().nullable().optional(),
	count: z.number(),
});

const journeyStepTypes = [
	"PRODUCT_SEARCHED",
	"STORE_VISITED",
	"PRODUCT_FOUND",
	"CHECKOUT_COMPLETED",
] as const;

const recoveryStepTypes = [
	"PRODUCT_NOT_FOUND",
	"RECOMMENDATIONS_VIEWED",
	"ALTERNATIVE_SELECTED",
	"ALTERNATIVE_FOUND",
	"ALTERNATIVE_CHECKOUT_COMPLETED",
] as const;

function funnelSchema<T extends readonly [string, ...string[]]>(types: T) {
	return z.object({
		steps: z.array(
			z.object({
				type: z.enum(types),
				count: z.number(),
			}),
		),
		averageDurationSeconds: z.number().nullable(),
	});
}

const funnelMetricsSchema = z.object({
	journey: funnelSchema(journeyStepTypes),
	recovery: funnelSchema(recoveryStepTypes),
});

export type MetricsOverview = z.infer<typeof metricsOverviewSchema>;
export type TopPath = z.infer<typeof topPathSchema>;
export type TopCompany = z.infer<typeof topCompanySchema>;
export type FunnelMetrics = z.infer<typeof funnelMetricsSchema>;
export type JourneyStepType = (typeof journeyStepTypes)[number];
export type RecoveryStepType = (typeof recoveryStepTypes)[number];

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

export async function getFunnelMetrics(params?: {
	from?: string;
	to?: string;
	companyId?: string;
}) {
	const searchParams = new URLSearchParams();

	if (params?.from) {
		searchParams.set("from", params.from);
	}

	if (params?.to) {
		searchParams.set("to", params.to);
	}

	if (params?.companyId) {
		searchParams.set("companyId", params.companyId);
	}

	const query = searchParams.toString();

	return apiRequest(
		`/metrics/funnel${query ? `?${query}` : ""}`,
		funnelMetricsSchema,
	);
}
