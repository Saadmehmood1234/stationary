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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ModernPrintingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Thesis & Binding",
      description: "Professional thesis printing and binding services",
      features: ["Spiral Binding", "Hard Cover", "Soft Cover"],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Photo Printing",
      description:
        "Premium photo and graphic printing with exceptional quality",
      features: ["Glossy/Matte", "High Resolution", "Multiple Sizes"],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Lamination",
      description:
        "Protect your important documents with professional lamination",
      features: ["A4/A3 Lamination", "Thick & Thin", "Instant Service"],
      gradient: "from-orange-500 to-red-500",
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
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
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
              className="text-5xl md:text-7xl font-bold text-white mb-6"
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

      <section className="py-10 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-100 mb-4"
            >
              Our Printing Services
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto"
            >
              From simple documents to complex projects, we handle all your
              printing needs with precision and care.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {printingServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-500 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-300 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-slate-300"
                    >
                      <div className="w-1.5 h-1.5 bg-[#D5D506] rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D5D506]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-gray-300 mb-8">
                How It Works
              </h2>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Upload & Specify",
                    desc: "Upload your files and specify your printing requirements",
                    icon: <Upload className="w-5 h-5" />,
                  },
                  {
                    step: "02",
                    title: "Instant Quote",
                    desc: "Get immediate pricing and production timeline",
                    icon: <FileText className="w-5 h-5" />,
                  },
                  {
                    step: "03",
                    title: "Quality Production",
                    desc: "Professional printing with thorough quality assurance",
                    icon: <Printer className="w-5 h-5" />,
                  },
                  {
                    step: "04",
                    title: "Ready for Collection",
                    desc: "Collect your perfectly printed materials",
                    icon: <CheckCircle className="w-5 h-5" />,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#D5D506] to-[#D5D502] rounded-xl flex items-center justify-center text-gray-900 font-bold text-sm">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-[#D5D506]">{item.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-300">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#D5D506] to-[#D5D502] p-6">
                <div className="flex items-center gap-3">
                  <IndianRupeeIcon className="w-6 h-6 text-gray-900" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Transparent Pricing
                  </h2>
                </div>
                <p className="text-[#D5D506] mt-1">
                  No hidden costs, no surprises
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {printingPrices.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-slate-700 last:border-b-0"
                    >
                      <span className="text-slate-300">{item.type}</span>
                      <span className="font-semibold text-[#D5D502]">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[#D5D502]/10 rounded-xl border border-[#D5D502]/20">
                  <p className="text-sm text-[#D5D502]">
                    🎓 <strong>Student Discount:</strong> 10% off on all
                    printing services with valid student ID
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-200 mb-4">
              Send Us Your Files
            </h2>
            <p className="text-slate-400">
              Choose your preferred method to get started
            </p>
          </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
  {[
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      desc: "Quick file sharing & instant chat support",
      color: "from-green-500 to-emerald-500",
      action: () => window.open('https://wa.me/9911523323', '_blank')
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      desc: "Send large files with detailed specifications",
      color: "from-[#D5D502] to-yellow-500",
      action: () => window.location.href = 'mailto:printing@yourstore.com'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Online Form",
      desc: "Detailed specifications with instant quote",
      color: "from-purple-500 to-pink-500",
      action: () => setIsModalOpen(true)
    },
  ].map((method, index) => (
    <motion.button
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={method.action}
      className="group p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-slate-500 transition-all duration-300 text-left relative overflow-hidden"
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {method.icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
      <p className="text-slate-400 text-sm">{method.desc}</p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Print Request
                    </h2>
                    <p className="text-slate-400 mt-1">
                      Get an instant quote for your printing needs
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Request Submitted Successfully!
                    </h3>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                      {selectedFile
                        ? "Your file has been securely uploaded and your print request is being processed. We'll contact you shortly."
                        : "We've received your print request. Please send your files via WhatsApp or Email to complete the order."}
                    </p>
                    <div className="bg-[#D5D506]/10 p-4 rounded-xl border border-[#D5D506]/20 max-w-md mx-auto">
                      <p className="font-semibold text-[#D5D506]">
                        Estimated Cost: ₹{calculateEstimatedCost()}
                      </p>
                      <p className="text-sm text-[#D5D506] mt-1">
                        Final price confirmed upon file review
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload */}
                    <div className="bg-slate-700/50 rounded-xl border border-slate-600 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Upload className="w-5 h-5 text-[#D5D506]" />
                        <h3 className="text-lg font-semibold text-white">
                          Upload Your File
                        </h3>
                        <span className="text-slate-400 text-sm">
                          (Optional)
                        </span>
                      </div>

                      {!selectedFile ? (
                        <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 transition-colors">
                          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                          <p className="text-slate-400 mb-4">
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
                            className="bg-[#D5D506] hover:bg-[#D5D506] text-gray-900 px-6 py-3 rounded-lg"
                          >
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2 text-gray-900" />
                              Choose File
                            </label>
                          </Button>
                          <p className="text-sm text-slate-500 mt-3">
                            PDF, Word, PowerPoint, Images • Max 10MB
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-600/50 p-4 rounded-lg border border-slate-500">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-[#D5D506]" />
                              <div>
                                <p className="font-medium text-white">
                                  {selectedFile.name}
                                </p>
                                <p className="text-sm text-slate-400">
                                  {formatFileSize(selectedFile.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleRemoveFile}
                              className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {filePreview && (
                            <div className="mb-3">
                              <img
                                src={filePreview}
                                alt="File preview"
                                className="max-w-32 max-h-32 object-cover rounded-lg border border-slate-500"
                              />
                            </div>
                          )}

                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full bg-slate-500 rounded-full h-2 mb-2">
                              <div
                                className="bg-[#D5D506] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}

                          {uploadProgress > 0 && (
                            <div className="flex justify-between items-center text-sm text-slate-400">
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
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-400 text-sm">{fileError}</p>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">
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
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-[#D5D506]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">
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
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-[#D5D506]/20"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email" className="text-slate-300">
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
                          className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-[#D5D506]/20"
                        />
                      </div>
                    </div>

                    {/* Print Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="paperSize" className="text-slate-300">
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
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506]">
                            <SelectValue placeholder="Select paper size" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600 text-white">
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="A3">A3</SelectItem>
                            <SelectItem value="Letter">Letter</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="colorType" className="text-slate-300">
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
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506]">
                            <SelectValue placeholder="Select color type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600 text-white">
                            <SelectItem value="bw">Black & White</SelectItem>
                            <SelectItem value="color">Color</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pageCount" className="text-slate-300">
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
                          className="bg-slate-700 border-slate-600 text-white focus:border-[#D5D506] focus:ring-[#D5D506]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="binding" className="text-slate-300">
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
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506]">
                            <SelectValue placeholder="Select binding" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600 text-white">
                            <SelectItem value="none">No Binding</SelectItem>
                            <SelectItem value="spiral">
                              Spiral Binding
                            </SelectItem>
                            <SelectItem value="stapler">Stapler</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="urgency" className="text-slate-300">
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
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-[#D5D506]/20 focus:border-[#D5D506]">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600 text-white">
                            <SelectItem value="normal">
                              Normal (24-48 hours)
                            </SelectItem>
                            <SelectItem value="urgent">
                              Urgent (Same day) +30%
                            </SelectItem>
                            <SelectItem value="express">
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
                        className="text-slate-300"
                      >
                        Special Instructions
                      </Label>
                      <textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        rows={4}
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-[#D5D506] focus:ring-2 focus:ring-[#D5D506]/20 transition-colors resize-none"
                        placeholder="Any special requirements, file details, or additional instructions..."
                      />
                    </div>

                    {/* Cost Estimate */}
                    <div className="bg-gradient-to-r from-[#D5D506] to-[#D5D502] rounded-xl p-6 text-gray-900">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-lg">
                            Estimated Cost
                          </p>
                          <p className="text-[#D5D506] text-sm">
                            Inclusive of all charges
                          </p>
                        </div>
                        <p className="text-3xl font-bold">
                          ₹{calculateEstimatedCost()}
                        </p>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-slate-700 border-slate-600 rounded-full text-slate-300 hover:bg-slate-600 hover:text-white h-12 text-base font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !!isSubmitting ||
                          (!!selectedFile && uploadProgress < 90)
                        }
                        className="flex-1 rounded-full bg-gradient-to-r from-[#D5D506] to-yellow-400 hover:from-[#D5D506] hover:to-yellow-300 text-gray-900 h-12 text-base font-semibold shadow-lg hover:shadow-[#D5D506]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
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
    </div>
  );
}
