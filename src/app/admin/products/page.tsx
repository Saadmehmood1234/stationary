import Link from "next/link";
import { Product } from "@/types";

const mockProducts: Product[] = [
  {
    _id: "1",
    sku: "PEN-GEL-BLUE-07",
    name: "Premium Gel Pen - Blue",
    description:
      "Smooth writing gel pen with comfortable rubber grip and vibrant blue ink",
    shortDescription: "Smooth gel pen with comfortable grip",
    price: 3.99,
    comparePrice: 4.99,
    costPrice: 1.5,
    stock: 150,
    lowStockAlert: 20,
    trackQuantity: true,
    category: "pens-writing",
    subcategory: "gel-pens",
    tags: ["bestseller", "smooth-writing", "student"],
    brand: "InkWell",
    images: ["/images/products/gel-pen-blue-1.jpg"],
    primaryImage: "/images/products/gel-pen-blue-1.jpg",
    specifications: {
      color: "Blue",
      material: "Plastic with rubber grip",
      size: "",
      weight: 15,
      dimensions: {
        length: 14.5,
        width: 1.2,
        height: 1.2,
      },
      penType: "gel",
      inkColor: "Blue",
      pointSize: "0.7mm",
      paperType: undefined, // Changed from '' to undefined
      pageCount: 0,
      binding: undefined, // Changed from '' to undefined
    },
    status: "active",
    isFeatured: true,
    isBestSeller: true,
    slug: "premium-gel-pen-blue",
    viewCount: 1245,
    sellCount: 89,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
];

export default function ProductsPage() {
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

      <div className="card">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          {product.shortDescription}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.sku}</td>
                    <td className="py-3 px-4">${product.price}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "out_of_stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
