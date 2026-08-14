import axios, { type AxiosRequestConfig } from "axios";
import type { z } from "zod";

type ApiRequestOptions = Pick<
	AxiosRequestConfig,
	"headers" | "method" | "signal"
> & {
	body?: unknown;
};

function getApiBaseUrl() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL;
	if (!baseUrl) {
		throw new Error("The API URL is not configured. Set NEXT_PUBLIC_API_URL.");
	}

	return baseUrl.replace(/\/$/, "");
}

export async function apiRequest<T>(
	path: string,
	schema: z.ZodType<T>,
	options: ApiRequestOptions = {},
): Promise<T> {
	const { body, ...requestOptions } = options;

	try {
		const response = await axios.request<unknown>({
			...requestOptions,
			baseURL: getApiBaseUrl(),
			data: body,
			url: path,
			withCredentials: true,
			headers: {
				Accept: "application/json",
				...options.headers,
			},
		});

		return schema.parse(response.data);
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(
				`The API request failed with status ${error.response.status}.`,
			);
		}

		throw error;
	}
}
