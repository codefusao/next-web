export function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.addEventListener("load", () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
				return;
			}

			reject(new Error("Não foi possível ler a imagem do mapa."));
		});
		reader.addEventListener("error", () =>
			reject(new Error("Não foi possível ler a imagem do mapa.")),
		);
		reader.readAsDataURL(file);
	});
}
