"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

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

  const swiperImages = [
    "/stationary1.jpg",
    "/stationary2.jpeg",
    "/stationary3.jpg",
    "/stationary4.jpg",
    "/stationary5.jpg",
    "/stationary6.jpg",
    "/stationary7.jpg",
    "/stationary8.avif",
    "/stationary9.jpeg",
    "/stationary10.jpg",
    "/stationary11.jpg",
    "/stationary12.jpg",
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

      <div className="relative w-full min-h-screen overflow-hidden">
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center py-12 px-4">
          <div className="w-full max-w-7xl mx-auto px-4">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={true}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
              className="w-full"
            >
              {swiperImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden transition-all duration-500 hover:border-[#D5D502]/50 hover:shadow-lg hover:shadow-[#D5D502]/20">
                      <div className="relative w-full h-80 overflow-hidden rounded-3xl">
                        <img
                          src={image}
                          alt={`Stationery ${index + 1}`}
                          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                          style={{
                            aspectRatio: "4/3",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      </div>
                      
                      {/* <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="text-white">
                          <h3 className="text-xl font-bold mb-2">
                            Stationery {index + 1}
                          </h3>
                          <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            Premium quality stationery for your everyday needs
                          </p>
                          <button className="mt-4 cursor-pointer px-6 py-2 bg-[#D5D502] text-black font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:scale-105">
                            View Details
                          </button>
                        </div>
                      </div> */}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#D5D502] to-blue-300 bg-clip-text text-transparent"
              >
                Featured Products
              </motion.h2>
              
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                className="w-full"
              >
                {products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="group relative h-[500px]"
                    >
                      <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden h-full transition-all duration-500 hover:border-[#D5D502]/50 hover:shadow-sm hover:shadow-[#D5D502]/30">
                        <div className="absolute inset-0">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            style={{
                              aspectRatio: "16/9",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </div>
                        
                        <div className="relative h-full flex flex-col justify-end p-8">
                          <h3 className="text-2xl font-bold text-white mb-3">
                            {product.title}
                          </h3>
                          <p className="text-gray-200 mb-6">
                            {product.description}
                          </p>
                          <button className="self-start cursor-pointer px-6 py-3 bg-[#D5D502] text-black font-semibold rounded-full hover:bg-white hover:scale-105 transition-all duration-300">
                            {product.cta}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Custom Swiper Styles */}
          <style jsx global>{`
            .swiper-button-next,
            .swiper-button-prev {
              color: #D5D502;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              width: 50px;
              height: 50px;
              border-radius: 50%;
              border: 2px solid rgba(213, 213, 2, 0.3);
              transition: all 0.3s ease;
            }
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
              background: rgba(213, 213, 2, 0.2);
              border-color: #D5D502;
              transform: scale(1.1);
            }
            .swiper-button-next:after,
            .swiper-button-prev:after {
              font-size: 20px;
              font-weight: bold;
            }
            .swiper-pagination-bullet {
              background: rgba(255, 255, 255, 0.5);
              opacity: 0.5;
              width: 12px;
              height: 12px;
              transition: all 0.3s ease;
            }
            .swiper-pagination-bullet-active {
              background: #D5D502;
              opacity: 1;
              transform: scale(1.2);
            }
            .swiper-slide {
              height: auto;
            }
          `}</style>
        </div>

        {/* Decorative Elements */}
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