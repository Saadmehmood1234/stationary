"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push("/auth/verify-email?message=check-email");
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center sm:p-4">
      <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-gry-900" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-300 text-lg">
            Join Ali Books and start your reading journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-white/5 my-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-white/5 my-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={8}
                  className="bg-white/5 my-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-3">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-white/5 my-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-gradient-to-r from-yellow-500 to-[#D5D502] text-gray-900 rounded-full hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-white/20">
            <p className="text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-[#D5D502] hover:text-yellow-400 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}