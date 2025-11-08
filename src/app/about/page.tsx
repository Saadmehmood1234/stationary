"use client";
import React from "react";
import { motion } from "framer-motion";
import { PenTool, Palette, Heart } from "lucide-react";
const AboutUs = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900">
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
          style={{ top: "10%", left: "5%" }}
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
          style={{ top: "50%", right: "10%" }}
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
          style={{ bottom: "15%", left: "15%" }}
        />
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

      <div className="relative z-10 min-h-screen flex items-center justify-center py-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h3
              className="text-xl font-bold bg-gradient-to-r from-[#D5D502] to-blue-300 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              OUR STORY
            </motion.h3>
            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent">
                About Ali Book
              </span>
            </motion.h1>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-[#D5D502] to-blue-300 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ duration: 0.8, delay: 0.6 }}
            ></motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Our <span className="text-[#D5D502]">Mission</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                At Ali Book, we believe that the right tools can transform
                ordinary tasks into extraordinary experiences. Our mission is to
                provide premium stationery and books that inspire creativity,
                enhance productivity, and bring joy to everyday moments.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                From students and professionals to artists and writers, we
                curate collections that meet diverse needs while maintaining our
                commitment to quality, sustainability, and aesthetic excellence.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden h-80 transition-all duration-500 group hover:scale-105">
                <img
                  src="/about.jpeg"
                  alt="Our Mission"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </motion.div>
          </div>

          <div className="mb-20">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Our <span className="text-[#D5D502]">Values</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality Craftsmanship",
                  description:
                    "We source and create products with exceptional attention to detail, ensuring durability and superior performance.",
                  icon: <PenTool className="w-12 h-12" />,
                  color: "from-blue-400 to-blue-600",
                },
                {
                  title: "Inspiring Design",
                  description:
                    "Every item in our collection is chosen for its aesthetic appeal and ability to spark creativity.",
                  icon: <Palette className="w-12 h-12" />,
                  color: "from-purple-400 to-purple-600",
                },
                {
                  title: "Customer Focus",
                  description:
                    "We prioritize your needs and strive to provide an exceptional shopping experience from discovery to delivery.",
                  icon: <Heart className="w-12 h-12" />,
                  color: "from-pink-400 to-pink-600",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  className=" p-6 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r ${value.color} text-[#f1f1eb] group-hover:scale-110 transition-transform duration-300`}
                    >
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Meet Our <span className="text-[#D5D502]">Team</span>
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Ali Asad",
                  role: "Founder & CEO",
                  image: "/person.jpeg",
                },
                {
                  name: "Hasan Masood",
                  role: "Product Curator",
                  image: "/person2.jpg",
                },
                {
                  name: "Saad Mehmood",
                  role: "Creative Director",
                  image: "/person3.jpeg",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  className="text-center group"
                >
                  <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden mb-4 h-64 transition-all duration-500 group-hover:scale-105">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                      <div className="text-white">
                        <p className="font-bold">{member.name}</p>
                        <p className="text-sm text-[#D5D502]">{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-white">{member.name}</h3>
                  <p className="text-sm text-[#D5D502]">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="text-center backdrop-blur-lg rounded-3xl border border-white/20 p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Elevate Your Stationery Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Explore our curated collections and discover tools that inspire
              creativity and productivity.
            </p>
            <motion.button
              className="font-bold py-3 px-8 rounded-full text-lg bg-gradient-to-r from-yellow-500 to-primary text-gray-900 hover:from-yellow-600 hover:to-primary transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Shop Our Collection
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
