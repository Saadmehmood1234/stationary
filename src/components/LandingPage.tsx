"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      title: "Premium Writing Instruments",
      description:
        "Elevate your writing experience with our exquisite collection of pens and pencils",
      image: "/back2.jpg",
      cta: "Explore Collection",
    },
    {
      title: "Artistic Notebooks & Journals",
      description:
        "Capture your thoughts in style with our beautifully crafted notebooks",
      image: "/back.png",
      cta: "Shop Now",
    },
    {
      title: "Office Essentials",
      description:
        "Everything you need for a productive and organized workspace",
      image: "/back3.jpg",
      cta: "Discover More",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#017970] to-[#025c55] overflow-hidden">
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white space-y-6"
            >
              <h3>WELCOME TO ALI BOOK</h3>
              <motion.h1
                className="text-5xl lg:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your One-Stop
                <span className="text-[#ffd700] relative inline-block">
                  Shop for
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-1 bg-[#ffd700]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </span><br/>
                Books & Stationery
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-gray-200 max-w-lg"
              >
                From school and office supplies to printing services and
                everyday essentials.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <button className="bg-[#ffd700] text-[#017970] cursor-pointer px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg">
                  Shop Now
                </button>
                <button className="border-2 border-white text-white cursor-pointer px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#017970] transition-all duration-300">
                  Contact Us
                </button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-96 lg:h-[500px] rounded-2xl max-md:mb-12 overflow-hidden shadow-2xl"
            >
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{
                    opacity: currentSlide === index ? 1 : 0,
                    scale: currentSlide === index ? 1 : 1.1,
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <img
                    src={`${product?.image} `}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0  bg-opacity-40 flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {product.title}
                      </h3>
                      <p className="mb-4">{product.description}</p>
                      <button className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-[#017970] transition-all duration-300">
                        {product.cta}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-[#ffd700] scale-125"
                        : "bg-white bg-opacity-50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
