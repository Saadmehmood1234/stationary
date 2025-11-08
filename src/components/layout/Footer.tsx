import Link from "next/link";
import {
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import Image from "next/image";
export function Footer() {
  const social = [
    {
      id: 1,
      label: "Instagram",
      icons: Instagram,
      link: "#",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      label: "Youtube",
      icons: Youtube,
      link: "#",
      color: "from-red-500 to-red-600",
    },
    {
      id: 3,
      label: "LinkedIn",
      icons: Linkedin,
      link: "#",
      color: "from-blue-500 to-blue-600",
    },
  ];

  const quickLinks = [
    { name: "Shop All", href: "/shop" },
    { name: "Printing Services", href: "/printing" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
  ];

  const categories = [
    { name: "Pens & Markers", href: "/shop?category=pens" },
    { name: "Notebooks", href: "/shop?category=notebooks" },
    { name: "Art Supplies", href: "/shop?category=art-supplies" },
    { name: "Office Supplies", href: "/shop?category=office-supplies" },
  ];

  return (
    <footer className="relative border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D5D502] rounded-full blur-[80px] opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500 rounded-full blur-[60px] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="relative w-14 h-14 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full">
                <Image
                  src="/logo1.png"
                  alt="Ali Books Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="sr-only">Ali Books</span> {/* Accessible name */}
            </Link>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-[#D5D502] flex-shrink-0" />
                <span className="text-sm">
                  Ali Book, Tayyab Mosque, Shaheen Bagh, New Delhi 110025
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock size={18} className="text-[#D5D502] flex-shrink-0" />
                <span className="text-sm">Mon - Sun: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-[#D5D502] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-[#D5D502] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-300 hover:text-[#D5D502] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-[#D5D502] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex justify-start items-center">
              <div className="flex gap-3">
                {social.map((socialItem) => (
                  <a
                    key={socialItem.id}
                    href={socialItem.link}
                    className="group relative"
                  >
                    <div
                      className={`p-3 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 transition-all duration-300 group-hover:bg-gradient-to-br ${socialItem.color} group-hover:border-transparent`}
                    >
                      <socialItem.icons
                        size={20}
                        className="text-gray-300 group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="tel:+919911523323"
                className="flex items-center gap-3 text-gray-300 hover:text-[#D5D502] transition-colors duration-300 group"
              >
                <div className="p-2 bg-green-500/20 rounded-full group-hover:bg-green-500/30 transition-colors duration-300">
                  <Phone size={18} className="text-green-400" />
                </div>
                <span className="font-medium">+91-99115 23323</span>
              </a>

              <a
                href="mailto:mehmoodsaad347@gmail.com"
                className="flex items-center gap-3 text-gray-300 hover:text-[#D5D502] transition-colors duration-300 group"
              >
                <div className="p-2 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-colors duration-300">
                  <Mail size={18} className="text-blue-400" />
                </div>
                <span className="font-medium">mehmoodsaad347@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2025 Ali Books. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-[#D5D502] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#D5D502] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
