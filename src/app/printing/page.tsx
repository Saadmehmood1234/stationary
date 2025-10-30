"use client";

import { useRef, useState } from "react";
import { createPrintOrder } from "../actions/print.actions";
import { CreatePrintOrderInput } from "@/types";

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
      icon: "🖨️",
      title: "Standard Printing",
      description: "High-quality B&W and color printing",
      features: ["A4/A3 Sizes", "Multiple paper types", "Quick turnaround"],
    },
    {
      icon: "📚",
      title: "Thesis & Binding",
      description: "Professional thesis printing and binding",
      features: ["Spiral Binding", "Hard Cover", "Soft Cover"],
    },
    {
      icon: "🎨",
      title: "Photo Printing",
      description: "Premium photo and graphic printing",
      features: ["Glossy/Matte", "High Resolution", "Multiple Sizes"],
    },
    {
      icon: "📄",
      title: "Lamination",
      description: "Protect your important documents",
      features: ["A4/A3 Lamination", "Thick & Thin", "Instant Service"],
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="relative bg-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-90"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Professional Printing Services
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            High-quality printing with fast turnaround. Upload your files and
            get instant quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Request Print Online
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Upload Files
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Our Printing Services
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            From simple documents to complex projects, we handle all your
            printing needs with precision and care.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {printingServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold">Transparent Pricing</h2>
                <p className="opacity-90">No hidden costs, no surprises</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {printingPrices.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-700">{item.type}</span>
                      <span className="font-semibold text-gray-900">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    🎓 <strong>Student Discount:</strong> 10% off on all
                    printing services with valid student ID
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">How It Works</h2>
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Request & Upload",
                    desc: "Fill out our form and upload your files",
                  },
                  {
                    step: "02",
                    title: "Instant Quote",
                    desc: "Get immediate pricing and timeline",
                  },
                  {
                    step: "03",
                    title: "We Print & Quality Check",
                    desc: "Professional printing with quality assurance",
                  },
                  {
                    step: "04",
                    title: "Ready for Pickup/Delivery",
                    desc: "Collect your perfect prints",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Send Us Your Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-lg mb-2">WhatsApp</h3>
              <p className="text-green-100 text-sm">
                Quick file sharing & chat
              </p>
            </a>

            <a
              href="mailto:printing@yourstore.com"
              className="bg-blue-600 text-white p-6 rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-blue-100 text-sm">Send large files easily</p>
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 text-white p-6 rounded-2xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className="text-3xl mb-3">💻</div>
              <h3 className="font-semibold text-lg mb-2">Online Form</h3>
              <p className="text-purple-100 text-sm">Detailed specifications</p>
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Print Request
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-green-600">✓</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    {selectedFile
                      ? "File Uploaded & Request Submitted!"
                      : "Request Submitted Successfully!"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {selectedFile
                      ? "Your file has been securely uploaded to Cloudinary and your print request is being processed."
                      : "We've received your print request. Please send your files via WhatsApp or Email."}
                  </p>
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 max-w-md mx-auto">
                    <p className="font-semibold text-blue-900">
                      Estimated Cost: ₹{calculateEstimatedCost()}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {selectedFile
                        ? "File securely stored in Cloudinary"
                        : "Please send your files to complete the request"}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Upload Your File to Cloudinary{" "}
                      {!selectedFile && "(Optional)"}
                    </h3>

                    {!selectedFile ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">☁️</div>
                        <p className="text-gray-600 mb-4">
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
                        <label
                          htmlFor="file-upload"
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                        >
                          Choose File
                        </label>
                        <p className="text-sm text-gray-500 mt-3">
                          Supported: PDF, Word, PowerPoint, Images (Max: 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">
                              {getFileIcon(selectedFile.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(selectedFile.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            ×
                          </button>
                        </div>

                        {/* File Preview for Images */}
                        {filePreview && (
                          <div className="mb-3">
                            <img
                              src={filePreview}
                              alt="File preview"
                              className="max-w-32 max-h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}

                        {/* Upload Progress */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}

                        {uploadProgress > 0 && (
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>
                              {uploadProgress < 100
                                ? "Uploading to Cloudinary..."
                                : "Ready to submit"}
                            </span>
                            <span>{uploadProgress}%</span>
                          </div>
                        )}
                      </div>
                    )}

                    {fileError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{fileError}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Print Specifications */}
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Print Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paper Size *
                        </label>
                        <select
                          name="paperSize"
                          required
                          value={formData.paperSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="A4">A4</option>
                          <option value="A3">A3</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color Type *
                        </label>
                        <select
                          name="colorType"
                          required
                          value={formData.colorType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="bw">Black & White</option>
                          <option value="color">Color</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Pages *
                        </label>
                        <input
                          type="number"
                          name="pageCount"
                          required
                          min="1"
                          value={formData.pageCount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Binding
                        </label>
                        <select
                          name="binding"
                          value={formData.binding}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="none">No Binding</option>
                          <option value="spiral">Spiral Binding</option>
                          <option value="stapler">Stapler</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgency
                        </label>
                        <select
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="normal">Normal (24-48 hours)</option>
                          <option value="urgent">Urgent (Same day) +30%</option>
                          <option value="express">
                            Express (2-4 hours) +50%
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      rows={4}
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Any special requirements, file details, or additional instructions..."
                    />
                  </div>

                  {/* Cost Estimate */}
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-lg">
                          Estimated Cost
                        </span>
                        <p className="text-blue-100 text-sm">
                          Inclusive of all charges
                        </p>
                      </div>
                      <span className="text-3xl font-bold">
                        ₹{calculateEstimatedCost()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <span>🔒</span>
                    <span>Files securely stored in Cloudinary</span>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-500 text-white py-4 px-6 rounded-xl hover:bg-gray-600 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !!isSubmitting || (!!selectedFile && uploadProgress < 90)
                      }
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Uploading..." : "Submit Print Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
