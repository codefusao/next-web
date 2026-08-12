import { initialProducts } from "@/api/mock-data";
import { serverOperationNotConfigured } from "@/api/server-operation-not-configured";
import type { Product } from "@/types/product";

export type CreateProductInput = Omit<Product, "id">;

export async function getProducts(): Promise<Product[]> {
	return initialProducts;
}

export async function getProduct(productId: string): Promise<Product> {
	const product = initialProducts.find((item) => item.id === productId);
	if (!product) throw new Error("Produto de referência não encontrado.");
	return product;
}

export async function createProduct(
	_input: CreateProductInput,
): Promise<Product> {
	return serverOperationNotConfigured("criação de produto");
}
