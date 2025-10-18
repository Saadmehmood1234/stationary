import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#02726A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#FDC700] rounded-full"></div>
              <span className="text-xl font-bold">Ali Books</span>
            </Link>
            <p className="text-gray-200 mb-4 max-w-md">
              Your one-stop shop for premium stationery and reliable printing services. 
              Serving students and professionals with quality products.
            </p>
            <div className="text-gray-200">
              <p>📞 99115 23323</p>
              <p>✉️ hello@inkwell.com</p>
              <p>📍 123 Stationery Street, City, State 12345</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-200">
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link href="/printing" className="hover:text-white transition-colors">Printing Services</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-200">
              <li><Link href="/shop?category=pens" className="hover:text-white transition-colors">Pens & Markers</Link></li>
              <li><Link href="/shop?category=notebooks" className="hover:text-white transition-colors">Notebooks</Link></li>
              <li><Link href="/shop?category=art-supplies" className="hover:text-white transition-colors">Art Supplies</Link></li>
              <li><Link href="/shop?category=office-supplies" className="hover:text-white transition-colors">Office Supplies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#FDC700] mt-8 pt-8 text-center text-gray-200">
          <p>&copy; 2024 InkWell Stationery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}