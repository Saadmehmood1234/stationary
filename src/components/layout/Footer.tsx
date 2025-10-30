import Link from "next/link";
import { Instagram, Youtube, Linkedin, Mail, Phone } from "lucide-react";
export function Footer() {
  const social = [
    {
      id: 1,
      label: "Instagram",
      icons: Instagram,
      link: "#",
    },
    {
      id: 2,
      label: "Youtube",
      icons: Youtube,
      link: "#",
    },
    {
      id: 3,
      label: "Linkedun",
      icons: Linkedin,
      link: "#",
    },
  ];
  return (
    <footer className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#FDC700] rounded-full"></div>
              <span className="text-xl font-bold">Ali Books</span>
            </Link>
            <p className="text-gray-200 mb-4 max-w-md">
              Your one-stop shop for premium stationery and reliable printing
              services. Serving students and professionals with quality
              products.
            </p>
            
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-200">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/printing"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Printing Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-200">
              <li>
                <Link
                  href="/shop?category=pens"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Pens & Markers
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=notebooks"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Notebooks
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=art-supplies"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Art Supplies
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=office-supplies"
                  className="hover:text-[#FDC700] transition-colors"
                >
                  Office Supplies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-gray-200 flex justify-start max-md:flex-col max-md:mt-8 gap-4 max-w-5xl">
          <div className="flex gap-4">
              {social.map((s) => (
                <Link key={s.id} href={s.link}>
                  <s.icons
                    size={32}
                    className="hover:text-[#FDC700] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 p-1 rounded-md text-white border border-[#FDC700]"
                  />
                </Link>
              ))}
              </div>
              <div className="flex gap-6 max-md:gap-2 max-md:flex-col max-w-3xl w-full">
                <p className="flex gap-2 justify-center max-sm:justify-start items-center"><Link href="tel:+919876543210"><Phone size={32} className="hover:text-[#FDC700] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 p-1 rounded-md text-white border border-[#FDC700]"/></Link><span>99115 23323</span></p>
                <p className="flex gap-2 justify-center max-sm:justify-start items-center"><Link href="mailto:mehmoodsaad347@gmail.com?subject=Hello&body=Hi%20Saad,"><Mail size={32} className="hover:text-[#FDC700] bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 p-1 rounded-md text-white border border-[#FDC700]"/></Link><span>mehmoodsaad347@gmail.com</span></p>
              </div>
            </div>
        <div className="text-gray-200 flex justify-between w-full max-w-5xl"></div>
        <div className="border-t border-[#FDC700] mt-8 pt-8 text-center text-gray-200">
          <p>&copy; 2025 Ali Books. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
