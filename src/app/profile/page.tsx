"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  getUserProfile,
  updateUserProfile,
} from "../actions/userProfile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Edit,
  Eye,
  X,
  CreditCard,
  ShoppingBag,
  User2Icon,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useSession } from "@/components/providers/SessionWrapper";
import Image from "next/image";
import { getOrderById, getUserOrders } from "../actions/order.actions";
import Link from "next/link";
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  paymentStatus: "pending" | "paid" | "failed";
  collectionMethod: "pickup" | "delivery";
  notes?: string;
  subtotal?: number;
  tax?: number;
  paymentMethod?: string;
}

const getStatusTextColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-400";
    case "ready":
      return "text-blue-400";
    case "confirmed":
      return "text-blue-400";
    case "pending":
      return "text-yellow-400";
    case "cancelled":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "ready":
      return <Truck className="h-5 w-5 text-blue-500" />;
    case "confirmed":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "ready":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "confirmed":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "cancelled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function ProfilePage() {
  const { session, loading } = useProtectedRoute();
  const { refreshSession } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePic: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    loadUserProfile();
  }, [session, router]);

  useEffect(() => {
    if (tab === "orders") {
      loadUserOrders();
    }
  }, [tab]);

  const loadUserProfile = async () => {
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setUser(result.data || []);
        setFormData({
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          profilePic: result.data.profilePic || "",
          address: {
            street: result.data.address?.street || "",
            city: result.data.address?.city || "",
            state: result.data.address?.state || "",
            zipCode: result.data.address?.zipCode || "",
            country: result.data.address?.country || "",
          },
        });
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    }
  };

  const loadUserOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const result = await getUserOrders();
      if (result.success) {
        setOrders(result.data || []);
      } else {
        setOrdersError(result.message || "Failed to load orders");
        setOrders([]);
      }
    } catch (err: any) {
      setOrdersError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };
  const handleViewOrderDetails = async (order: Order) => {
    try {
      const result = await getOrderById(order.id);
      if (result.success) {
        console.log("Dtaa", result.data);
        if (result.data) {
          setSelectedOrder(result.data);
        } else {
          setOrdersError("Order data not found");
        }
      } else {
        setOrdersError(result.message || "Failed to load order details");
      }
    } catch (err: any) {
      setOrdersError(err.message || "Failed to load order details");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserProfile(formData);

      if (result.success) {
        setSuccess("Profile updated successfully!");
        await refreshSession();
        await loadUserProfile();
        setIsEditing(false);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "30%", left: "10%" }}
          />
          <motion.div
            className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
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
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
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

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Animated Icon Container */}
            <motion.div
              className="relative mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30 flex items-center justify-center mx-auto shadow-2xl shadow-[#D5D502]/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="h-10 w-10 text-[#D5D502]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-4">
                Loading Profile
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Preparing your Profile...
              </p>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D5D502] to-[#c4c400]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-[#D5D502] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-8 max-w-md w-full mx-4">
          <div className="text-center text-red-400">
            Failed to load user profile
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
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
          className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
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
        {[...Array(6)].map((_, i) => (
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
      {!selectedOrder && (
        <div className="w-full mt-12 flex justify-center items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-full p-1.5">
              <div className="flex gap-1">
                <button
                  onClick={() => setTab("profile")}
                  className={`flex-1 py-3 px-6 cursor-pointer rounded-full text-sm font-semibold transition-all duration-300 ${
                    tab === "profile"
                      ? "bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 rounded-full shadow-lg focus:ring-2 focus:ring-[#D5D402]/50 cursor-pointer"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </div>
                </button>
                <button
                  onClick={() => setTab("orders")}
                  className={`flex-1 py-3 px-6 cursor-pointer rounded-full text-sm font-semibold transition-all duration-300 ${
                    tab === "orders"
                      ? "bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 rounded-full shadow-lg focus:ring-2 focus:ring-[#D5D402]/50 cursor-pointer"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Package className="h-4 w-4" />
                    My Orders
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {tab === "profile" && (
        <div className="container mx-auto p-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-gray-400 text-center mt-3 text-lg">
              Manage your account information and preferences
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30 shadow-lg">
                        {session.profilePic && session.profilePic !== "" ? (
                          <Image
                            src={session.profilePic}
                            alt="Profile picture"
                            width={60}
                            height={60}
                            className="rounded-full h-20 w-20 object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D5D502] to-[#c4c400] flex items-center justify-center text-white font-bold text-lg">
                            <Image
                              src="/avatar.svg"
                              alt="Profile picture"
                              width={60}
                              height={60}
                              className="rounded-full h-20 w-20 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 min-w-0 flex-1">
                      <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
                        Personal Information
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm sm:text-base">
                        {isEditing
                          ? "Update your personal details and contact information"
                          : "View your personal details and contact information"}
                      </CardDescription>
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-shrink-0"
                  >
                    <Button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:from-[#c4c400] hover:to-[#b3b300] text-slate-900 hover:shadow-xl hover:shadow-[#D5D502]/30 transition-all duration-300 px-6 py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-[#D5D502]/20"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="whitespace-nowrap">Cancel Edit</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="whitespace-nowrap">
                            Edit Profile
                          </span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </div>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#D5D502] rounded-full animate-pulse"></div>
                        <span className="text-sm text-[#D5D502] font-medium">
                          Editing Mode
                        </span>
                      </div>
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-yellow-500 to-[#D5D502]"
                          animate={{
                            x: [-100, 100],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm"
                      >
                        {success}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                          <div className="p-1.5 bg-white/10 rounded-full border border-white/20">
                            <User className="h-4 w-4 text-[#D5D502]" />
                          </div>
                          Basic Info
                        </h3>

                        <div className="space-y-3">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-300"
                          >
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={saving}
                            className="bg-white/5 mt-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                          />
                        </div>

                        <div className="space-y-3">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-300 flex items-center gap-2"
                          >
                            <Mail className="h-4 w-4 text-[#D5D502]" />
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={saving}
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                          />
                          {!session.verified && (
                            <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                              Your email is not verified. Please check your
                              inbox for verification link.
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-300 flex items-center gap-2"
                          >
                            <Phone className="h-4 w-4 text-[#D5D502]" />
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={saving}
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                          <div className="p-1.5 bg-white/10 rounded-full border border-white/20">
                            <MapPin className="h-4 w-4 text-[#D5D502]" />
                          </div>
                          Address
                        </h3>

                        <div className="space-y-3">
                          <label
                            htmlFor="address.street"
                            className="text-sm font-medium text-gray-300"
                          >
                            Street Address
                          </label>
                          <Input
                            id="address.street"
                            name="address.street"
                            type="text"
                            placeholder="123 Main St"
                            value={formData.address.street}
                            onChange={handleChange}
                            disabled={saving}
                            className="bg-white/5 mt-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label
                              htmlFor="address.city"
                              className="text-sm font-medium text-gray-300"
                            >
                              City
                            </label>
                            <Input
                              id="address.city"
                              name="address.city"
                              type="text"
                              placeholder="City"
                              value={formData.address.city}
                              onChange={handleChange}
                              disabled={saving}
                              className="bg-white/5 mt-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                            />
                          </div>

                          <div className="space-y-3">
                            <label
                              htmlFor="address.state"
                              className="text-sm font-medium text-gray-300"
                            >
                              State
                            </label>
                            <Input
                              id="address.state"
                              name="address.state"
                              type="text"
                              placeholder="State"
                              value={formData.address.state}
                              onChange={handleChange}
                              disabled={saving}
                              className="bg-white/5 mt-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label
                              htmlFor="address.zipCode"
                              className="text-sm font-medium text-gray-300"
                            >
                              ZIP Code
                            </label>
                            <Input
                              id="address.zipCode"
                              name="address.zipCode"
                              type="text"
                              placeholder="12345"
                              value={formData.address.zipCode}
                              onChange={handleChange}
                              disabled={saving}
                              className="bg-white/5 mt-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                            />
                          </div>

                          <div className="space-y-3">
                            <label
                              htmlFor="address.country"
                              className="text-sm font-medium text-gray-300"
                            >
                              Country
                            </label>
                            <Input
                              id="address.country"
                              name="address.country"
                              type="text"
                              placeholder="Country"
                              value={formData.address.country}
                              onChange={handleChange}
                              disabled={saving}
                              className="bg-white/5 mt-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-300 flex items-center gap-2"
                      >
                        <User2Icon className="h-4 w-4 text-[#D5D502]" />
                        Profile Pic
                      </label>
                      <Input
                        id="profilePic"
                        name="profilePic"
                        type="tel"
                        placeholder="Enter profile pic  url.."
                        value={formData.profilePic}
                        onChange={handleChange}
                        disabled={saving}
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                      />
                    </div>
                    <div className="flex justify-end pt-6 border-t border-white/20 gap-4">
                      <Button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-gray-400 bg-gray-700 text-gray-400 cursor-pointer hover:bg-gray-800 hover:text-white transition-all duration-300 px-6 py-2.5 rounded-full font-semibold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="relative cursor-pointer overflow-hidden bg-gradient-to-r from-yellow-500 to-[#D5D502] text-slate-900 border-0 hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 px-8 py-2.5 rounded-full font-semibold"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 p-2 ">
                          <div className="p-3 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30">
                            <User className="h-5 w-5 sm:h-6 sm:w-6 text-[#D5D502]" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              Basic Info
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Personal identification details
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5 p-4 sm:p-6 rounded-2xl border border-white/10 ">
                          <div className="grid grid-cols-1  gap-4 sm:gap-5">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#D5D502] rounded-full"></div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                  Full Name
                                </label>
                              </div>

                              <div className="p-3">
                                <p className="text-white font-medium text-base sm:text-lg">
                                  {session.name || (
                                    <span className="text-gray-500 italic">
                                      Not provided
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-[#D5D502]" />
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                  Email Address
                                </label>
                              </div>
                              <div className="p-3">
                                <p className="text-white font-medium text-base sm:text-lg break-all">
                                  {session.email}
                                </p>
                                {!session.verified && (
                                  <div className="flex items-center gap-2 mt-2 p-2 bg-amber-500/10 rounded-full border border-amber-500/20">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs  text-amber-400">
                                      Email verification pending
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-[#D5D502]" />
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                  Phone Number
                                </label>
                              </div>
                              <div className="p-3">
                                <p className="text-white font-medium text-base sm:text-lg">
                                  {session.phone || (
                                    <span className="text-gray-500 italic">
                                      Not provided
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-4 p-2 ">
                          <div className="p-3 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30">
                            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#D5D502]" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                              Address
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Shipping and contact address
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5 p-4 sm:p-6 rounded-2xl border border-white/10 ">
                          <div className="grid grid-cols-1 gap-4 sm:gap-5">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#D5D502] rounded-full"></div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                  Street Address
                                </label>
                              </div>
                              <div className="p-3 ">
                                <p className="text-white font-medium text-base sm:text-lg">
                                  {session.address?.street || (
                                    <span className="text-gray-500 italic">
                                      Not provided
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-[#D5D502]/70 rounded-full"></div>
                                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    City
                                  </label>
                                </div>
                                <div className="p-3 ">
                                  <p className="text-white font-medium text-base sm:text-lg">
                                    {session.address?.city || (
                                      <span className="text-gray-500 italic">
                                        Not provided
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-[#D5D502]/70 rounded-full"></div>
                                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    State
                                  </label>
                                </div>
                                <div className="p-3 ">
                                  <p className="text-white font-medium text-base sm:text-lg">
                                    {session.address?.state || (
                                      <span className="text-gray-500 italic">
                                        Not provided
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-[#D5D502]/70 rounded-full"></div>
                                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    ZIP Code
                                  </label>
                                </div>
                                <div className="p-3 ">
                                  <p className="text-white font-medium text-base sm:text-lg">
                                    {session.address?.zipCode || (
                                      <span className="text-gray-500 italic">
                                        Not provided
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-[#D5D502]/70 rounded-full"></div>
                                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Country
                                  </label>
                                </div>
                                <div className="p-3 ">
                                  <p className="text-white font-medium text-base sm:text-lg">
                                    {session.address?.country || (
                                      <span className="text-gray-500 italic">
                                        Not provided
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
      {tab === "orders" && !selectedOrder && (
        <div className="container mx-auto p-4 sm:p-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
                  My Orders
                </h1>
                <p className="text-gray-400 text-center mt-3 text-base sm:text-lg">
                  Track and manage your orders
                </p>
              </div>
            </div>

            {ordersError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm mb-6"
              >
                {ordersError}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <div className="rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-white">
                  {orders.length}
                </div>
                <div className="text-gray-400 text-sm">Total Orders</div>
              </div>
              <div className="rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-green-400">
                  {
                    orders.filter((order) => order.status === "completed")
                      .length
                  }
                </div>
                <div className="text-gray-400 text-sm">Completed</div>
              </div>
              <div className="rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-blue-400">
                  {
                    orders.filter(
                      (order) =>
                        order.status === "pending" ||
                        order.status === "confirmed" ||
                        order.status === "ready"
                    ).length
                  }
                </div>
                <div className="text-gray-400 text-sm">Processing</div>
              </div>
              <div className="rounded-2xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-[#D5D502]">
                  ₹
                  {orders
                    .reduce((total, order) => total + order.total, 0)
                    .toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm">Total Spent</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {ordersLoading ? (
                <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
                      animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{ top: "30%", left: "10%" }}
                    />
                    <motion.div
                      className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
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
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
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

                  {/* Main Content */}
                  <div className="flex items-center justify-center min-h-screen relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      {/* Animated Icon Container */}
                      <motion.div
                        className="relative mb-8"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="w-24 h-24 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30 flex items-center justify-center mx-auto shadow-2xl shadow-[#D5D502]/10">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <RefreshCw className="h-10 w-10 text-[#D5D502]" />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Text Content */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-4">
                          Loading Order
                        </h2>
                        <p className="text-gray-400 text-lg mb-6 max-w-md">
                          Preparing your Orders...
                        </p>

                        {/* Progress Bar */}
                        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#D5D502] to-[#c4c400]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </div>

                        {/* Loading Dots */}
                        <div className="flex justify-center space-x-2 mt-6">
                          {[0, 1, 2].map((index) => (
                            <motion.div
                              key={index}
                              className="w-2 h-2 bg-[#D5D502] rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: index * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    onViewDetails={handleViewOrderDetails}
                  />
                ))
              ) : (
                <EmptyOrders />
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
      <AnimatePresence>
        {selectedOrder && tab === "orders" && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const OrderCard = ({
  order,
  index,
  onViewDetails,
}: {
  order: Order;
  index: number;
  onViewDetails: (order: Order) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl hover:border-[#D5D502]/30 transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="p-3 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30">
                {getStatusIcon(order.status)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                {order.orderNumber}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                {new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <span
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#D5D502]">
              ₹{order.total.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              Order Items ({order.items.length})
            </h4>
            <span className="text-sm text-gray-400">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <div className="space-y-3">
            {order.items.slice(0, 2).map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-2 h-2 bg-[#D5D502] rounded-full flex-shrink-0"></div>
                  <span className="text-white text-sm sm:text-base truncate">
                    {item.name}
                  </span>
                </div>
                <div className="text-gray-400 text-sm sm:text-base whitespace-nowrap ml-4">
                  {item.quantity} × ₹{item.price.toFixed(2)}
                </div>
              </div>
            ))}

            {order.items.length > 2 && (
              <div className="text-center py-2">
                <span className="text-gray-400 text-sm">
                  +{order.items.length - 2} more items
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-6 border-t border-white/10 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Package className="h-4 w-4" />
            <span>
              Order placed {new Date(order.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onViewDetails(order)}
                className="cursor-pointer bg-gradient-to-r from-[#EDB400] to-[#c4c400] text-slate-900 hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 px-4 py-2 rounded-full font-semibold text-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/track-order/${order.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer border-[#D5D502] text-[#D5D502] bg-gray-800 hover:bg-[#D5D502] hover:text-slate-900 px-4 py-2 rounded-full font-semibold text-sm"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const EmptyOrders = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12"
  >
    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
      <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
      No Orders Yet
    </h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
      Start exploring our products and make your first order to see them here
    </p>
    <Button className="rounded-full cursor-pointer bg-gradient-to-r from-yellow-500 to-[#D5D502] text-slate-900 hover:shadow-lg hover:shadow-[#D5D502]/25 px-8 py-3">
      <ShoppingBag className="h-4 w-4 mr-2" />
      Start Shopping
    </Button>
  </motion.div>
);

const OrderDetailsModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className=" inset-0 bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 backdrop-blur-sm z-[50] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="z-100 bg-gradient-to-br from-[#171E21] to-slate-900 rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            className="h-8 cursor-pointer rounded-full hover:bg-gray-800 hover:text-red-400 w-8 p-0 text-gray-400 "
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-gray-400 mt-1">{order.id}</p>
      </div>

      <div className="p-6 z-[100] overflow-y-auto max-h-[calc(90vh-200px)]">
        <OrderDetailsContent order={order} />
      </div>
    </motion.div>
  </motion.div>
);

const OrderDetailsContent = ({ order }: any) => (
  <div className="space-y-6 z-100">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#D5D502]" />
          Order Information
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Order Date:</span>
            <span className="text-white">
              {new Date(order.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span
              className={`font-semibold ${getStatusTextColor(order.status)}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Items:</span>
            <span className="text-white">{order.items.length}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#D5D502]" />
          Payment Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-white">₹{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Shipping:</span>
            <span className="text-green-400">Free</span>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-gray-400 font-semibold">Total:</span>
            <span className="text-[#D5D502] font-bold text-lg">
              ₹{order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Order Items</h3>
      <div className="space-y-3">
        {order.items.map((item: any, index: any) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-[#D5D502]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{item.name}</h4>
                <p className="text-gray-400 text-sm">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
              <p className="text-gray-400 text-sm">
                ₹{item.price.toFixed(2)} each
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
      <Link href={`/track-order/${order.id}`} className="w-full">
        <Button
          variant="outline"
          className="w-full cursor-pointer border-[#D5D502] text-[#D5D502] bg-gray-800 hover:bg-[#D5D502] hover:text-slate-900 px-4 py-2 rounded-full font-semibold text-sm"
        >
          <Truck className="h-4 w-4 mr-2" />
          Track Order
        </Button>
      </Link>
    </div>
  </div>
);
