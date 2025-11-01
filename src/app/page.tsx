"use client";
import Link from "next/link";
import LandingPage from "@/components/LandingPage";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ShopClientHome from "@/components/ShopClientHome";
import { getProducts } from "./actions/product.actions";
import { Product } from "@/types";

export default function HomePage() {
  const sectionRef = useRef(null);
  const [product, setProduct] = useState<Product[]>([]);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const fetchData = async () => {
    const res = await getProducts({ limit: 1000 });
    const serializedProducts = JSON.parse(JSON.stringify(res.products || []));
    setProduct(serializedProducts);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const features = [
    {
      icon: "🚀",
      image: "/printing.jpg",
      title: "Fast Printing",
      description:
        "Quick turnaround on all printing jobs with professional quality and precision.",
      gradient: "from-blue-400/20 to-[#D5D502]/20",
      border: "border-blue-300/30",
    },
    {
      icon: "💰",
      image: "/discount.jpg",
      title: "Student Discounts",
      description:
        "Special prices and exclusive offers for students with valid ID cards.",
      gradient: "from-blue-400/20 to-[#D5D502]/20",
      border: "border-blue-300/30",
    },
    {
      icon: "🏪",
      image: "/local.jpg",
      title: "Local & Reliable",
      description:
        "Serving the community for years with trusted and reliable services.",
      gradient: "from-blue-400/20 to-[#D5D502]/20",
      border: "border-blue-300/30",
    },
  ];
  return (
    <div className="relative bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-10"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "40%", right: "10%" }}
        />
      </div>

      <LandingPage />

      <section ref={sectionRef} className="relative py-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Featured Stationery
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our most popular stationery items loved by students and
              professionals alike
            </motion.p>
          </motion.div>

          <ShopClientHome initialProducts={product} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-4"
          >
            <Link
              href="/shop"
              className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden font-medium text-gray-900 transition duration-300 ease-out rounded-full group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-primary text-white rounded-full hover:from-yellow-600 hover:to-primary"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-[#D5D502] rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative text-lg font-semibold">
                View All Products
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
      <section className="relative py-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
              Why Choose Ali Book?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                <div
                  className={`relative bg-white/5 backdrop-blur-lg rounded-3xl border ${feature.border} overflow-hidden md:h-72 h-auto transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#D5D502]/10`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 w-full h-48 md:h-auto relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D5D502]/10 to-blue-500/10">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 md:bg-gradient-to-r bg-gradient-to-b from-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <div className="absolute top-3 left-3 md:top-4 md:left-4">
                        <span className="bg-[#D5D502]/20 text-[#D5D502] px-2 py-1 rounded-full text-xs md:text-sm font-medium border border-[#D5D502]/30 backdrop-blur-sm">
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    <div className="md:w-1/2 w-full flex flex-col justify-center p-6 md:p-8 relative z-10">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white group-hover:text-[#D5D502] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 mt-4 md:mt-6">
                        <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
                        <span className="text-[#D5D502] text-xs md:text-sm font-medium">
                          Premium Service
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 md:bg-gradient-to-t bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative py-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-12 max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D5D502]/10 to-blue-600/10 rounded-3xl"></div>

            <div className="relative z-10">
              <motion.h2
                className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Need Printing Services?
              </motion.h2>

              <motion.p
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Upload your documents via WhatsApp or Email and get professional
                printing with quick turnaround.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link
                  href="/printing"
                  className="relative inline-flex items-center justify-center px-12 py-3 overflow-hidden font-medium text-gray-900 transition duration-300 ease-out rounded-full group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-primary text-white rounded-full hover:from-yellow-600 hover:to-primary"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-300 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative text-lg font-semibold">
                    Learn More About Printing
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
