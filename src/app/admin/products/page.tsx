import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/app/actions/product.actions";
import ProductTable from "@/components/ProductTable";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
    const res = await getProducts({ limit: 1000 });
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">Products</h1>
            <p className="text-gray-400 mt-2">Manage your product catalog</p>
          </div>
          <Link 
            href="/admin/products/create" 
            className="bg-gradient-to-r from-yellow-500 to-[#D5D502] text-gray-900 rounded-full px-6 py-3 hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>
        <ProductTable products={res.products}/>
      </div>
    </div>
  );
}