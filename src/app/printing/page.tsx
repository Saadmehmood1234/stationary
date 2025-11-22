"use client";

import { useRef, useState } from "react";
import { createPrintOrder } from "../actions/print.actions";
import { CreatePrintOrderInput } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Printer,
  BookOpen,
  Image,
  Shield,
  Clock,
  IndianRupeeIcon,
  CheckCircle,
  X,
  Send,
  Loader2,
  MessageCircle,
  Mail,
  ArrowRight,
  GraduationCap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ModernPrintingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paperSize: "A4",
    colorType: "bw",
    pageCount: 1,
    binding: "none",
    urgency: "normal",
    specialInstructions: "",
  });

  const printingServices = [
    {
      icon: <Printer className="w-8 h-8" />,
      title: "Standard Printing",
      description:
        "High-quality B&W and color printing for all your document needs",
      features: ["A4/A3 Sizes", "Multiple paper types", "Quick turnaround"],
      gradient: "from-[#D5D506] to-[#D5D502]",
      details: {
        pricing: [
          { type: "B&W Printing (A4)", price: "₹2/page" },
          { type: "Color Printing (A4)", price: "₹10/page" },
          { type: "B&W Printing (A3)", price: "₹5/page" },
          { type: "Color Printing (A3)", price: "₹20/page" },
        ],
        turnaround: "Same day service available",
        paperTypes: [
          "70 GSM",
          "80 GSM",
          "100 GSM",
          "Art Paper",
          "Glossy Paper",
        ],
        additionalInfo:
          "Perfect for documents, assignments, reports, and presentations",
      },
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Thesis & Binding",
      description: "Professional thesis printing and binding services",
      features: ["Spiral Binding", "Hard Cover", "Soft Cover"],
      gradient: "from-purple-500 to-pink-500",
      details: {
        pricing: [
          { type: "Spiral Binding", price: "₹50-150" },
          { type: "Hard Cover Binding", price: "₹200-500" },
          { type: "Soft Cover Binding", price: "₹100-300" },
          { type: "Thesis Printing", price: "₹3/page" },
        ],
        turnaround: "2-3 days for binding",
        paperTypes: ["70 GSM", "80 GSM", "100 GSM Bond Paper"],
        additionalInfo:
          "Specialized service for academic theses, projects, and research papers",
      },
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Photo Printing",
      description:
        "Premium photo and graphic printing with exceptional quality",
      features: ["Glossy/Matte", "High Resolution", "Multiple Sizes"],
      gradient: "from-green-500 to-emerald-500",
      details: {
        pricing: [
          { type: "4x6 Photo", price: "₹15-25" },
          { type: "5x7 Photo", price: "₹30-50" },
          { type: "8x10 Photo", price: "₹80-120" },
          { type: "A4 Photo Print", price: "₹60-100" },
        ],
        turnaround: "1-2 hours",
        paperTypes: [
          "Glossy Photo Paper",
          "Matte Photo Paper",
          "Premium Lustre",
        ],
        additionalInfo:
          "Ideal for photographs, artwork, certificates, and special occasions",
      },
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Lamination",
      description:
        "Protect your important documents with professional lamination",
      features: ["A4/A3 Lamination", "Thick & Thin", "Instant Service"],
      gradient: "from-orange-500 to-red-500",
      details: {
        pricing: [
          { type: "A4 Lamination", price: "₹20-40" },
          { type: "A3 Lamination", price: "₹40-80" },
          { type: "ID Card Lamination", price: "₹10-20" },
          { type: "Thick Lamination", price: "+50%" },
        ],
        turnaround: "15-30 minutes",
        paperTypes: [
          "Standard Lamination",
          "Thick Lamination",
          "Matte/Glossy Finish",
        ],
        additionalInfo:
          "Protect certificates, IDs, photos, and important documents from wear and tear",
      },
    },
  ];

  const printingPrices = [
    { type: "Black & White (A4)", price: "₹2/page" },
    { type: "Color (A4)", price: "₹10/page" },
    { type: "Black & White (A3)", price: "₹5/page" },
    { type: "Color (A3)", price: "₹20/page" },
    { type: "Spiral Binding", price: "₹50-100" },
    { type: "Lamination (A4)", price: "₹20/page" },
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError("");
    setFilePreview("");

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size must be less than 10MB");
        setSelectedFile(null);
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (!allowedTypes.includes(file.type)) {
        setFileError("Please select a PDF, Word, PowerPoint, or image file");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setUploadProgress(0);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Clear interval after completion
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
      }, 2200);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setFileError("");
    setFilePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pageCount" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFileError("");

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      const result = await createPrintOrder(formDataToSend);

      if (result.success) {
        setUploadProgress(100);
        setSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            paperSize: "A4",
            colorType: "bw",
            pageCount: 1,
            binding: "none",
            urgency: "normal",
            specialInstructions: "",
          });
          setSelectedFile(null);
          setUploadProgress(0);
          setFilePreview("");
        }, 4000);
      } else {
        setFileError(result.error || "Failed to submit order");
      }
    } catch (error) {
      console.error("Failed to submit order:", error);
      setFileError("An error occurred while submitting your order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType === "application/pdf") return "📕";
    if (fileType.includes("word") || fileType.includes("document")) return "📄";
    if (fileType.includes("powerpoint") || fileType.includes("presentation"))
      return "📊";
    return "📁";
  };

  const calculateEstimatedCost = () => {
    let cost = 0;
    const pageCount = formData.pageCount || 1;

    if (formData.paperSize === "A4") {
      cost += formData.colorType === "color" ? 10 * pageCount : 2 * pageCount;
    } else if (formData.paperSize === "A3") {
      cost += formData.colorType === "color" ? 20 * pageCount : 5 * pageCount;
    }

    if (formData.binding === "spiral") {
      cost += 50;
    }

    if (formData.urgency === "urgent") {
      cost += cost * 0.3;
    } else if (formData.urgency === "express") {
      cost += cost * 0.5;
    }

    return Math.round(cost);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900">
      <section className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D5D506]/10 via-transparent to-transparent" />

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent pb-6"
            >
              Printing Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              High-quality printing with fast turnaround. Upload your files and
              get instant quotes with our professional printing services.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative cursor-pointer bg-gradient-to-r from-[#D5D506] to-[#D5D502] text-gray-900 px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:shadow-[#D5D506]/25 transition-all duration-300 flex items-center gap-3"
              >
                <Printer className="w-5 h-5" />
                Request Print Online
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-16 sm:py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#D5D506]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
         

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {printingServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-6 sm:p-8 h-full overflow-hidden transition-all duration-500 hover:border-[#D5D506]/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-[#D5D506]/10">
                  {/* Service Icon */}
                  <div className="relative z-10 mb-6">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4`}
                    >
                      {service.icon}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
                      <div className="w-1.5 h-1.5 bg-[#D5D506] rounded-full"></div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-[#D5D506] transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.05 + 0.5 }}
                          className="flex items-center text-sm text-slate-200 group-hover:text-white transition-colors duration-300"
                        >
                          <div className="w-2 h-2 bg-[#D5D506] rounded-full mr-3 group-hover:scale-150 transition-transform duration-300 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.8 }}
                      className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                    >
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setIsServiceModalOpen(true);
                        }}
                        className="w-full max-lg:mb-4 bg-white/10 hover:bg-[#D5D506] text-slate-300 hover:text-gray-900 font-semibold py-3 rounded-full cursor-pointer border border-white/10 hover:border-[#D5D506] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D5D506]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-[#D5D506]/20 transition-all duration-500"></div>

                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <div className="w-3 h-3 bg-[#D5D506] rounded-full animate-ping"></div>
                  </div>
                </div>

                {/* Connection Lines for Desktop */}
                {index < printingServices.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#D5D506] to-transparent opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-4">
              <span className="text-slate-300 text-lg">
                Ready to start your project?
              </span>
              <Button onClick={()=>{setIsModalOpen(true)}} className="cursor-pointer bg-gradient-to-r from-[#D5D506] to-yellow-400 hover:from-[#D5D506] hover:to-yellow-300 text-gray-900 font-bold px-8 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#D5D506]/25">
                Get Instant Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#D5D506]/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* How It Works Section - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent pb-6 mb-4"
                >
                  How It{" "}
                  <span className="bg-gradient-to-r from-white via-[#D5D502] to-blue-200 bg-clip-text text-transparent pb-6">
                    Works
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-400 text-lg max-w-2xl"
                >
                  Simple, transparent process from upload to collection
                </motion.p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Upload & Specify",
                    desc: "Upload your files and specify your printing requirements with our easy-to-use form",
                    icon: <Upload className="w-5 h-5" />,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    step: "02",
                    title: "Instant Quote",
                    desc: "Get immediate pricing and production timeline with no hidden costs",
                    icon: <FileText className="w-5 h-5" />,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    step: "03",
                    title: "Quality Production",
                    desc: "Professional printing with thorough quality assurance and premium materials",
                    icon: <Printer className="w-5 h-5" />,
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    step: "04",
                    title: "Ready for Collection",
                    desc: "Collect your perfectly printed materials or opt for delivery",
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: "from-green-500 to-emerald-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group relative"
                  >
                    <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 transition-all duration-500 hover:border-[#D5D506]/30 hover:bg-white/10 overflow-hidden">
                      {/* Connection Line (except for last item) */}
                      {index < 3 && (
                        <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-[#D5D506] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300 hidden lg:block"></div>
                      )}

                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            {item.step}
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg">
                            {item.icon}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D5D506] transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-slate-300 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <div className="w-8 h-8 bg-[#D5D506] rounded-full flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-gray-900" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-br from-[#D5D506]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-8"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-[#D5D506]/10 transition-all duration-500">
                <div className="bg-gradient-to-r from-[#D5D506] to-yellow-400 p-6 sm:p-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <IndianRupeeIcon className="w-7 h-7 text-gray-900" />
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Transparent Pricing
                      </h2>
                    </div>
                    <p className="text-gray-800 font-medium">
                      No hidden costs, no surprises
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -translate-y-16 translate-x-16"></div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="space-y-4">
                    {printingPrices.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-[#D5D506]/30 hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#D5D506] rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                          <span className="text-slate-200 font-medium group-hover:text-white transition-colors">
                            {item.type}
                          </span>
                        </div>
                        <span className="font-bold text-[#D5D506] text-lg group-hover:scale-110 transition-transform duration-300">
                          {item.price}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-[#D5D506]/10 to-blue-500/10 rounded-2xl border border-[#D5D506]/20 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D5D506] rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-gray-900" />
                      </div>
                      <div>
                        <p className="text-[#D5D506] font-semibold text-sm sm:text-base">
                          🎓 Student Discount
                        </p>
                        <p className="text-slate-300 text-xs sm:text-sm mt-1">
                          10% off on all printing services with valid student ID
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-200 mb-4">
              Send Us Your Files
            </h2>
            <p className="text-slate-400">
              Choose your preferred method to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {[
              {
                icon: <MessageCircle className="w-5 h-5" />,
                title: "WhatsApp",
                desc: "Quick file sharing & instant chat support",
                color: "from-green-500 to-emerald-500",
                action: () =>
                  window.open("https://wa.me/919911523323", "_blank"),
              },
              {
                icon: <Mail className="w-5 h-5" />,
                title: "Email",
                desc: "Send large files with detailed specifications",
                color: "from-[#D5D502] to-yellow-500",
                action: () =>
                  (window.location.href = "mailto:mehmoodsaad347@gmail.com"),
              },
              {
                icon: <FileText className="w-5 h-5" />,
                title: "Online Form",
                desc: "Detailed specifications with instant quote",
                color: "from-purple-500 to-pink-500",
                action: () => setIsModalOpen(true),
              },
            ].map((method, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={method.action}
                className="group cursor-pointer p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-[#D5D502]/40 transition-all duration-400 h-24 overflow-hidden relative"
              >
                {/* Default State */}
                <div className="flex gap-4 items-center justify-center h-full transition-all duration-300 group-hover:opacity-0">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-white shadow-md`}
                  >
                    {method.icon}
                  </div>
                  <span className="text-white text-lg ">{method.title}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300">
                  <div className="text-center">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {method.title}
                    </h3>
                    <p className="text-gray-300 text-xs leading-tight">
                      {method.desc}
                    </p>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`}
                ></div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-b border-white/10 p-4 sm:p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                      Print Request
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                      Get an instant quote for your printing needs
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {submitted ? (
                  <div className="text-center py-6 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-green-500/30">
                      <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                      Request Submitted Successfully!
                    </h3>
                    <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                      {selectedFile
                        ? "Your file has been securely uploaded and your print request is being processed. We'll contact you shortly."
                        : "We've received your print request. Please send your files via WhatsApp or Email to complete the order."}
                    </p>
                    <div className="bg-[#D5D506]/10 p-3 sm:p-4 rounded-xl border border-[#D5D506]/20 max-w-md mx-auto">
                      <p className="font-semibold text-[#D5D506] text-sm sm:text-base">
                        Estimated Cost: ₹{calculateEstimatedCost()}
                      </p>
                      <p className="text-[#D5D506]/80 text-xs sm:text-sm mt-1">
                        Final price confirmed upon file review
                      </p>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 sm:space-y-8"
                  >
                    {/* File Upload Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6">
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <div className="p-2 bg-[#D5D506]/20 rounded-lg">
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-[#D5D506]" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-white">
                            Upload Your File
                          </h3>
                          <span className="text-slate-400 text-xs sm:text-sm">
                            (Optional)
                          </span>
                        </div>
                      </div>

                      {!selectedFile ? (
                        <div className="text-center py-6 sm:py-8 border-2 border-dashed border-white/20 rounded-lg hover:border-[#D5D506]/40 transition-all duration-300 bg-white/2">
                          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-500 mx-auto mb-3 sm:mb-4" />
                          <p className="text-slate-400 text-sm sm:text-base mb-3 sm:mb-4">
                            Files are securely stored in Cloudinary
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                            className="hidden"
                            id="file-upload"
                          />
                          <Button
                            asChild
                            variant="default"
                            className="bg-[#D5D506] hover:bg-[#D5D506]/90 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-[#D5D506]/25"
                          >
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer flex items-center justify-center"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </label>
                          </Button>
                          <p className="text-slate-500 text-xs sm:text-sm mt-3">
                            PDF, Word, PowerPoint, Images • Max 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/5 p-3 sm:p-4 rounded-lg border border-white/10">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-[#D5D506]/20 rounded-lg flex-shrink-0">
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#D5D506]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-white text-sm sm:text-base truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-slate-400 text-xs sm:text-sm">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleRemoveFile}
                              className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 cursor-pointer rounded-full text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>

                          {filePreview && (
                            <div className="mb-3 flex justify-center">
                              <img
                                src={filePreview}
                                alt="File preview"
                                className="max-w-24 max-h-24 sm:max-w-32 sm:max-h-32 object-cover rounded-lg border border-white/10"
                              />
                            </div>
                          )}

                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                              <div
                                className="bg-[#D5D506] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}

                          {uploadProgress > 0 && (
                            <div className="flex justify-between items-center text-xs sm:text-sm text-slate-400">
                              <span>
                                {uploadProgress < 100
                                  ? "Uploading..."
                                  : "Ready to submit"}
                              </span>
                              <span>{uploadProgress}%</span>
                            </div>
                          )}
                        </div>
                      )}

                      {fileError && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-400 text-xs sm:text-sm">
                            {fileError}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-[#D5D506]/20 text-sm sm:text-base h-11 sm:h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-[#D5D506]/20 text-sm sm:text-base h-11 sm:h-12"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label
                          htmlFor="email"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-[#D5D506]/20 text-sm sm:text-base h-11 sm:h-12"
                        />
                      </div>
                    </div>

                    {/* Print Specifications */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="paperSize"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Paper Size *
                        </Label>
                        <Select
                          name="paperSize"
                          required
                          value={formData.paperSize}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "paperSize", value },
                            } as any)
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506] text-sm sm:text-base h-11 sm:h-12">
                            <SelectValue placeholder="Select paper size" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#171E21] border-white/10 text-white">
                            <SelectItem
                              value="A4"
                              className="text-sm sm:text-base"
                            >
                              A4
                            </SelectItem>
                            <SelectItem
                              value="A3"
                              className="text-sm sm:text-base"
                            >
                              A3
                            </SelectItem>
                            <SelectItem
                              value="Letter"
                              className="text-sm sm:text-base"
                            >
                              Letter
                            </SelectItem>
                            <SelectItem
                              value="Legal"
                              className="text-sm sm:text-base"
                            >
                              Legal
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="colorType"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Color Type *
                        </Label>
                        <Select
                          name="colorType"
                          required
                          value={formData.colorType}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "colorType", value },
                            } as any)
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506] text-sm sm:text-base h-11 sm:h-12">
                            <SelectValue placeholder="Select color type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#171E21] border-white/10 text-white">
                            <SelectItem
                              value="bw"
                              className="text-sm sm:text-base"
                            >
                              Black & White
                            </SelectItem>
                            <SelectItem
                              value="color"
                              className="text-sm sm:text-base"
                            >
                              Color
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="pageCount"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Number of Pages *
                        </Label>
                        <Input
                          id="pageCount"
                          name="pageCount"
                          type="number"
                          required
                          min="1"
                          value={formData.pageCount}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/10 text-white focus:border-[#D5D506] focus:ring-[#D5D506]/20 text-sm sm:text-base h-11 sm:h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="binding"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Binding
                        </Label>
                        <Select
                          name="binding"
                          value={formData.binding}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "binding", value },
                            } as any)
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506] text-sm sm:text-base h-11 sm:h-12">
                            <SelectValue placeholder="Select binding" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#171E21] border-white/10 text-white">
                            <SelectItem
                              value="none"
                              className="text-sm sm:text-base"
                            >
                              No Binding
                            </SelectItem>
                            <SelectItem
                              value="spiral"
                              className="text-sm sm:text-base"
                            >
                              Spiral Binding
                            </SelectItem>
                            <SelectItem
                              value="stapler"
                              className="text-sm sm:text-base"
                            >
                              Stapler
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label
                          htmlFor="urgency"
                          className="text-slate-300 text-sm sm:text-base"
                        >
                          Urgency
                        </Label>
                        <Select
                          name="urgency"
                          value={formData.urgency}
                          onValueChange={(value) =>
                            handleInputChange({
                              target: { name: "urgency", value },
                            } as any)
                          }
                        >
                          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506] text-sm sm:text-base h-11 sm:h-12">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#171E21] border-white/10 text-white">
                            <SelectItem
                              value="normal"
                              className="text-sm sm:text-base"
                            >
                              Normal (24-48 hours)
                            </SelectItem>
                            <SelectItem
                              value="urgent"
                              className="text-sm sm:text-base"
                            >
                              Urgent (Same day) +30%
                            </SelectItem>
                            <SelectItem
                              value="express"
                              className="text-sm sm:text-base"
                            >
                              Express (2-4 hours) +50%
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="specialInstructions"
                        className="text-slate-300 text-sm sm:text-base"
                      >
                        Special Instructions
                      </Label>
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows={3}
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-2 focus:ring-[#D5D506]/20 transition-colors resize-none text-sm sm:text-base"
                        placeholder="Any special requirements, file details, or additional instructions..."
                      />
                    </div>

                    {/* Cost Estimate */}
                    <div className="bg-gradient-to-r from-[#D5D506] to-yellow-400 rounded-xl p-4 sm:p-6 text-gray-900">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <p className="font-semibold text-base sm:text-lg">
                            Estimated Cost
                          </p>
                          <p className="text-gray-700 text-xs sm:text-sm">
                            Inclusive of all charges
                          </p>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold">
                          ₹{calculateEstimatedCost()}
                        </p>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-white/5 border-white/10 rounded-full text-slate-300 hover:bg-white/10 hover:text-white h-11 sm:h-12 text-sm sm:text-base font-semibold transition-all duration-300 order-2 sm:order-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !!isSubmitting ||
                          (!!selectedFile && uploadProgress < 100)
                        }
                        className="flex-1 cursor-pointer rounded-full bg-gradient-to-r from-[#D5D506] to-yellow-400 hover:from-[#D5D506] hover:to-yellow-300 text-gray-900 h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-[#D5D506]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 order-1 sm:order-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                            {selectedFile ? "Uploading..." : "Submitting..."}
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            Submit Print Request
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {isServiceModalOpen && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
            onClick={() => setIsServiceModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/10 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex-shrink-0 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 border-b border-white/10 p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedService.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                    >
                      {selectedService.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {selectedService.title}
                      </h2>
                      <p className="text-slate-300 text-lg">
                        {selectedService.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsServiceModalOpen(false)}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white cursor-pointer transition-all duration-300 flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Features & Info */}
                  <div className="space-y-8">
                    {/* Key Features */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#D5D506]" />
                        Key Features
                      </h3>
                      <ul className="space-y-3">
                        {selectedService.features.map(
                          (feature: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center text-slate-200"
                            >
                              <div className="w-2 h-2 bg-[#D5D506] rounded-full mr-3 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </motion.li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#D5D506]" />
                        Service Details
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {selectedService.details.additionalInfo}
                      </p>
                    </div>

                    {/* Paper Types */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h3 className="text-xl font-bold text-white mb-4">
                        Available Paper Types
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedService.details.paperTypes.map(
                          (paper: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-2 bg-white/10 rounded-full text-slate-300 text-sm border border-white/5"
                            >
                              {paper}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Pricing & CTA */}
                  <div className="space-y-8">
                    {/* Pricing */}
                    <div className="bg-gradient-to-br from-[#D5D506]/10 to-blue-500/10 rounded-2xl border border-[#D5D506]/20 p-6">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <IndianRupeeIcon className="w-5 h-5 text-[#D5D506]" />
                        Pricing
                      </h3>
                      <div className="space-y-4">
                        {selectedService.details.pricing.map(
                          (item: any, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0"
                            >
                              <span className="text-slate-300">
                                {item.type}
                              </span>
                              <span className="font-bold text-[#D5D506] text-lg">
                                {item.price}
                              </span>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Turnaround Time */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#D5D506]" />
                        Turnaround Time
                      </h3>
                      <p className="text-slate-300 text-lg font-semibold">
                        {selectedService.details.turnaround}
                      </p>
                      <p className="text-slate-400 text-sm mt-2">
                        Rush service available for urgent requirements
                      </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setIsServiceModalOpen(false);
                          setIsModalOpen(true)
                        }}
                        className="w-full cursor-pointer bg-gradient-to-r from-[#D5D506] to-yellow-400 hover:from-[#D5D506] hover:to-yellow-300 text-gray-900 font-bold py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-[#D5D506]/25 flex items-center justify-center gap-2"
                      >
                        <Printer className="w-5 h-5" />
                        Get Instant Print
                      </button>

                      <button
                        onClick={() => setIsServiceModalOpen(false)}
                        className="w-full cursor-pointer bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-semibold py-3 rounded-xl border border-white/10 transition-all duration-300"
                      >
                        Browse Other Services
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
