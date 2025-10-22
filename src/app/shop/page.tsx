import { getProducts } from "@/app/actions/product.actions";
import ShopClient from "@/components/ShopClient";
import { Product } from "@/types";

export default async function ShopPage() {
  const res = await getProducts({ limit: 1000 });

  if (!res.success) {
    console.error("Failed to fetch products:", res.error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading products: {res.error}</p>
        </div>
      </div>
    );
  }

  const serializedProducts = JSON.parse(JSON.stringify(res.products || []));

  return <ShopClient initialProducts={serializedProducts} />;
}