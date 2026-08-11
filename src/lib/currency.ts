export function toBrl(value: string) {
	const amount = Number(value.replace(",", "."));

	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(amount);
}
