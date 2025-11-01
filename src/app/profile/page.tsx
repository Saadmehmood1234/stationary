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
import { Loader2, Save, User, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!authUser) {
      router.push("/auth/signin");
      return;
    }
    loadUserProfile();
  }, [authUser, router]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const result = await getUserProfile();
      if (result.success && result.data) {
        setUser(result.data);
        setFormData({
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
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
    } finally {
      setLoading(false);
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
        await refreshUser();
        await loadUserProfile();
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
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5D502]"></div>
      </div>
    );
  }

  if (!user) {
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
      {/* Animated Background Elements */}
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

      <div className="container mx-auto p-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Manage your account information and preferences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-white text-2xl">
                <div className="p-2 bg-[#D5D502]/20 rounded-lg border border-[#D5D502]/30">
                  <User className="h-6 w-6 text-[#D5D502]" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                      <div className="p-1.5 bg-white/10 rounded-lg border border-white/20">
                        <User className="h-4 w-4 text-[#D5D502]" />
                      </div>
                      Basic Info
                    </h3>

                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-medium text-gray-300">
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
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
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
                      {!user.verified && (
                        <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                          Your email is not verified. Please check your inbox for verification link.
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
                      <div className="p-1.5 bg-white/10 rounded-lg border border-white/20">
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
                        className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
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
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
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
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
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
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
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
                          className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/20">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="relative overflow-hidden bg-gradient-to-r from-yellow-500 to-[#D5D502] text-white border-0 hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 px-8 py-2.5 rounded-xl font-semibold"
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}