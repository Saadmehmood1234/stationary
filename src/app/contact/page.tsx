"use client";
import { Phone, MapPin, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactSchema } from "@/lib/zod-validation/contact-validation";
import toast from "react-hot-toast";
import { contactForm } from "../actions/contact.actions";
import Link from "next/link";

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
        toast.error(result.message || "There was an error sending your message.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto w-full max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col">
          <div className="text-center lg:text-left mb-8 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Contact Us
            </h1>
            <p className="text-gray-600 max-w-2xl text-lg sm:text-xl mx-auto lg:mx-0">
              Get in touch with us for any questions, special requests, or
              printing inquiries.
            </p>
          </div>
        
          <div className="mt-4 lg:mt-8 flex justify-center lg:justify-start items-center">
            <img 
              src="/contact.png" 
              alt="Contact Us"
              className="w-full max-w-md lg:max-w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
            Send us a Message
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none focus:ring-[#027068] focus:border-transparent transition-all duration-200 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none focus:ring-[#027068] focus:border-transparent transition-all duration-200 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                {...register("subject")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none focus:ring-[#027068] focus:border-transparent transition-all duration-200 ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="What is this regarding?"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message *
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none focus:ring-[#027068] focus:border-transparent transition-all duration-200 resize-vertical ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Tell us how we can help you..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
              <div className="mt-1 text-sm text-gray-500">
                {watchMessage ? `${watchMessage.length}/500` : "0/500"} characters
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#027068] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#025e56] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-[#027068] focus:ring-offset-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-12 lg:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center lg:text-left text-gray-900">
          Get In Touch
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#027068] bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex gap-3 justify-start items-center">
              <div className="p-2 bg-[#027068]/10 rounded-lg">
                <MapPin size={20} className="text-[#027068]" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Address</h3>
            </div>
            <div className="text-gray-600 leading-relaxed">
              Ali Book, Tayyab Mosque<br />
              Shaheen Bagh Okhla New Delhi 110025
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#027068] bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex gap-3 justify-start items-center">
              <div className="p-2 bg-[#027068]/10 rounded-lg">
               <Link href="tel:+919911523323"> <Phone size={20} className="text-[#027068]" /></Link>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Phone</h3>
            </div>
            <div className="text-gray-600"><Link href="tel:+919911523323">+91-99115 23323</Link></div>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#027068] bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex gap-3 justify-start items-center">
              <div className="p-2 bg-[#027068]/10 rounded-lg">
                <Link href="mailto:mehmoodsaad347@gmail.com"><Mail size={20} className="text-[#027068]" /></Link>
              </div>
              <h3 className="font-bold text-lg text-gray-900">Email</h3>
            </div>
            <div className="text-gray-600 break-all"><Link href="mailto:mehmoodsaad347@gmail.com">mehmoodsaad347@gmail.com</Link></div>
          </div>
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#027068] bg-white hover:shadow-lg transition-all duration-200">
            <div className="flex gap-3 justify-start items-center">
              <div className="p-2 bg-[#027068]/10 rounded-lg">
                <Clock size={20} className="text-[#027068]" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Business Hours</h3>
            </div>
            <div className="text-gray-600">
              Mon - Sun: 9:00 AM - 7:00 PM
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 lg:mt-16 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
          Find Us
        </h2>
        <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7622658300556!2d77.30055967495358!3d28.546864587966777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce41be7fa0e79%3A0xf5aab92c434b57cd!2sMasjid%20Tayyab%2C%20Shaheen%20Bagh!5e0!3m2!1sen!2sin!4v1760973845434!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </div>
  );
}