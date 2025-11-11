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
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "60%", right: "15%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-25"
          animate={{
            x: [0, 60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "10%", left: "20%" }}
        />
      </div>

      <div className="relative mt-12 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex justify-center gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white space-y-6 relative z-10"
            >
              <motion.h3
                className="text-center md:text-xl text-sm font-bold bg-gradient-to-r from-[#D5D502] to-blue-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                WELCOME TO ALI BOOK
              </motion.h3>
              <motion.h1
                className="md:text-7xl sm:text-6xl text-4xl lg:text-8xl text-center font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
                  Your One-Stop
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#D5D502] via-white to-purple-200 bg-clip-text text-transparent">
                  Shop for
                </span>
                <span className="bg-gradient-to-r ml-2 from-blue-200 via-[#D5D502] to-white bg-clip-text text-transparent">
                  Books & Stationery
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="lg:text-2xl md:text-xl text-lg text-center bg-gradient-to-r from-gray-200 to-[#D5D502] bg-clip-text text-transparent max-w-4xl mx-auto leading-relaxed"
              >
                From school and office supplies to printing services and
                everyday essentials.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
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

      <div className="relative w-full min-h-screen  overflow-hidden">
        <div className="relative z-10 min-h-screen flex items-center justify-center py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="grid grid-cols-4 md:grid-cols-12 gap-6 lg:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group md:col-span-4"
              >
                <div className="relative bg-white/5 backdrop-blur-lg sm:rounded-3xl rounded-full border border-white/20 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D5D502]/20 to-blue-500/20">
                    <img
                      src="/stationary6.jpg"
                      alt="Luxury Pens Collection"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="group md:col-span-6"
              >
                <div className="relative bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-lg sm:rounded-3xl rounded-full border border-purple-300/30 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <img
                    src="/stationary2.jpeg"
                    alt="Stationery Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="group md:col-span-5"
              >
                <div className="relative bg-white/5 backdrop-blur-lg sm:rounded-3xl rounded-full border border-white/20 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-pink-500/20">
                    <img
                      src="/stationary5.jpg"
                      alt="Artistic Notebooks"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="group md:col-span-3"
              >
                <div className="relative bg-white/5 backdrop-blur-lg sm:rounded-3xl rounded-full border border-white/20 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-bl from-blue-400/20 to-[#D5D502]/20">
                    <img
                      src="/stationary4.jpg"
                      alt="Office Essentials"
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                    />
                  </div>

                  <div className="absolute inset-0 bg-[#D5D502]/0 group-hover:bg-[#D5D502]/10 transition-all duration-500 rounded-3xl"></div>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-12 gap-6 lg:gap-8 mt-6 lg:mt-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="group md:col-span-3"
              >
                <div className="relative bg-white/5 backdrop-blur-lg sm:rounded-3xl rounded-full border border-white/20 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <img
                    src="/stationary3.jpg"
                    alt="Writing Instruments"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="group md:col-span-6"
              >
                <div className="relative bg-gradient-to-br from-purple-500/15 to-pink-600/15 backdrop-blur-lg sm:rounded-3xl rounded-full border border-purple-300/30 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <img
                    src="/stationary2.jpeg"
                    alt="Stationery Collection"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="group md:col-span-3"
              >
                <div className="relative bg-white/5 backdrop-blur-lg sm:rounded-3xl rounded-full border border-white/20 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <img
                    src="/stationary1.jpg"
                    alt="Desk Accessories"
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                  />
                </div>
              </motion.div>
                            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group md:col-span-4"
              >
                <div className="relative bg-white/5 backdrop-blur-lg sm:rounded-3xl rounded-full border border-white/20 overflow-hidden h-64 md:h-80 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D5D502]/20 to-blue-500/20">
                    <img
                      src="/stationary6.jpg"
                      alt="Luxury Pens Collection"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            </div>
          </div>
          <style jsx>{`
            .group:hover {
              transform: perspective(1000px) rotateX(5deg) rotateY(5deg)
                scale(1.02);
              transition: transform 0.5s ease;
            }
            .group {
              transition: transform 0.5s ease;
            }
          `}</style>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D5D502] rounded-full"
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
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
    </div>
  );
};

export default LandingPage;
