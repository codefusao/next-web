import { AddProductForm } from "@/components/products/add-product-form";
import { AddedProductsSection } from "@/components/products/added-products-section";

export default function ProductsPage() {
	return (
		<section>
			<AddProductForm />
			<AddedProductsSection />
		</section>
	);
}
