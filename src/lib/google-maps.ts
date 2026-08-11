export function getGoogleMapsEmbedUrl(address: string) {
	return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
