import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.leroymerlin.com.br",
				pathname: "/products/**",
			},
		],
	},
};

export default nextConfig;
