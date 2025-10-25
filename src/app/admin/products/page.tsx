import Link from "next/link";
import { Product } from "@/types";
import { useState } from "react";
import { getProducts } from "@/app/actions/product.actions";
import ProductTable from "@/components/ProductTable";

export default async function ProductsPage() {
    const res = await getProducts({ limit: 1000 });
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/create" className="btn-primary">
          + Add Product
        </Link>
      </div>
       <ProductTable products={res.products}/>

    </div>
  );
}
