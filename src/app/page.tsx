import Link from "next/link";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import LandingPage from "@/components/LandingPage";

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.isFeatured);

  return (
    <div>
      <LandingPage />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Stationary Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular stationery items loved by students and
              professionals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop" className="btn-primary text-lg px-8 py-3">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Printing</h3>
              <p className="text-gray-600">
                Quick turnaround on all printing jobs
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Discounts</h3>
              <p className="text-gray-600">Special prices for students</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Local & Reliable</h3>
              <p className="text-gray-600">Serving the community for years</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Printing Services?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your documents via WhatsApp or Email and get professional
            printing with quick turnaround.
          </p>
          <Link href="/printing" className="btn-primary text-lg px-8 py-3">
            Learn More About Printing
          </Link>
        </div>
      </section>
    </div>
  );
}
