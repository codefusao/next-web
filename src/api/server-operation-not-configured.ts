export function serverOperationNotConfigured<T>(operation: string): Promise<T> {
	return Promise.reject(
		new Error(
			`A operação de servidor ainda não foi configurada: ${operation}.`,
		),
	);
}
