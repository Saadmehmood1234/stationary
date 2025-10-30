"use client";
import { Phone, MapPin, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactSchema } from "@/lib/zod-validation/contact-validation";
import toast from "react-hot-toast";
import { contactForm } from "../actions/contact.actions";
import Link from "next/link";
import { motion } from "framer-motion";

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const watchMessage = watch("message", "");

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", data);
      const result = await contactForm(data);

      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(
          result.message || "There was an error sending your message."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      content: "Ali Book, Tayyab Mosque\nShaheen Bagh Okhla New Delhi 110025",
      link: "#",
      color: "from-blue-500 to-[#D5D502]",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91-99115 23323",
      link: "tel:+919911523323",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email",
      content: "mehmoodsaad347@gmail.com",
      link: "mailto:mehmoodsaad347@gmail.com",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Sun: 9:00 AM - 7:00 PM",
      link: "#",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="relative min-h-screenbg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-80 h-80 bg-[#D5D502] rounded-full blur-[100px] opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-15"
          animate={{
            x: [0, -100, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "60%", right: "8%" }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#D5D502] to-blue-400 rounded-full opacity-60"
            animate={{
              y: [0, -120, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto w-full max-w-7xl px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
            <span className="text-[#D5D502] text-sm font-medium">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Reach out to us for any questions, special requests, or printing
            inquiries. We're here to help!
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 ">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#D5D502]/20 rounded-2xl">
                  <MessageCircle className="text-[#D5D502]" size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Let's Connect
                </h2>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Whether you need printing services, stationery supplies, or have
                any questions, we're just a message away. Get in touch and let's
                create something amazing together.
              </p>

              <div className="mt-4 flex justify-center lg:justify-start">
                <div className="relative w-full ">
                  <img
                    src="/contact.png"
                    alt="Contact Us"
                    className="w-full h-64 object-cover rounded-2xl shadow-2xl border border-white/10"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-3"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full px-4 py-4 bg-white/5 border rounded-2xl focus:ring-2 outline-none focus:ring-[#D5D502] focus:border-[#D5D502]/50 transition-all duration-200 text-white placeholder-gray-400 ${
                    errors.name ? "border-red-500/50" : "border-white/10"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-3"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-4 py-4 bg-white/5 border rounded-2xl focus:ring-2 outline-none focus:ring-[#D5D502] focus:border-[#D5D502]/50 transition-all duration-200 text-white placeholder-gray-400 ${
                    errors.email ? "border-red-500/50" : "border-white/10"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-3"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject")}
                  className={`w-full px-4 py-4 bg-white/5 border rounded-2xl focus:ring-2 outline-none focus:ring-[#D5D502] focus:border-[#D5D502]/50 transition-all duration-200 text-white placeholder-gray-400 ${
                    errors.subject ? "border-red-500/50" : "border-white/10"
                  }`}
                  placeholder="What is this regarding?"
                />
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-3"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className={`w-full px-4 py-4 bg-white/5 border rounded-2xl focus:ring-2 outline-none focus:ring-[#D5D502] focus:border-[#D5D502]/50 transition-all duration-200 text-white placeholder-gray-400 resize-vertical ${
                    errors.message ? "border-red-500/50" : "border-white/10"
                  }`}
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.message.message}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-400">
                  {watchMessage ? `${watchMessage.length}/500` : "0/500"}{" "}
                  characters
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full cursor-pointer bg-gradient-to-r from-[#D5D502] to-primary  hover:from-[#D5D502] hover:to-primary text-white py-4 px-6 rounded-full font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden"
              >
                
                {isSubmitting ? (
                  <span className="relative flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <Send size={20} />
                    Send Message
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
              Get In Touch
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group h-full"
              >
                <Link href={item.link} className="block h-full">
                  <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 h-full transition-all duration-500 group-hover:border-[#D5D502]/30 group-hover:bg-white/10 group-hover:shadow-2xl group-hover:shadow-[#D5D502]/10 flex flex-col">
                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors duration-300 flex-shrink-0">
                          <item.icon size={20} className="text-[#D5D502]" />
                        </div>
                        <h3 className="font-bold text-lg text-white group-hover:text-[#D5D502] transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line flex-1">
                        {item.content}
                      </div>
                    </div>\
                    <div className="absolute bottom-4 left-6 w-8 h-0.5 bg-[#D5D502] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#D5D502]/20 rounded-2xl">
              <MapPin className="text-[#D5D502]" size={24} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Find Us
            </h2>
          </div>

          <div className="aspect-video w-full bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7622658300556!2d77.30055967495358!3d28.546864587966777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce41be7fa0e79%3A0xf5aab92c434b57cd!2sMasjid%20Tayyab%2C%20Shaheen%20Bagh!5e0!3m2!1sen!2sin!4v1760973845434!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
