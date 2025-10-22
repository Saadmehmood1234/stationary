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
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#027068]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Failed to load user profile
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account information and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-500 bg-green-50 border border-green-200 rounded-lg">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
                </h3>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
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
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
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
                  />
                  {!user.verified && (
                    <p className="text-xs text-amber-600">
                      Your email is not verified. Please check your inbox for
                      verification link.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
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
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>

                <div className="space-y-2">
                  <label
                    htmlFor="address.street"
                    className="text-sm font-medium"
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="address.city"
                      className="text-sm font-medium"
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
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="address.state"
                      className="text-sm font-medium"
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="address.zipCode"
                      className="text-sm font-medium"
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
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="address.country"
                      className="text-sm font-medium"
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
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                className="bg-[#027068] hover:bg-[#025e56]"
                disabled={saving}
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
    </div>
  );
}
