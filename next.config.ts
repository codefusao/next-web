import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "https",
				hostname: "cdn.leroymerlin.com.br",
				pathname: "/products/**",
			},
			{
				protocol: "https",
				hostname: "cdn.leroymerlin.com.br",
				pathname: "/contents/**",
			},
		],
	},
};

export default nextConfig;
