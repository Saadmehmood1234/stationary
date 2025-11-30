"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2, BookOpen, RefreshCw } from "lucide-react";
import {motion} from "framer-motion";
import { useSession } from "@/components/providers/SessionWrapper";
function SigninContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { refreshSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const result = await loginUser(formData);

      if (result.success) {
        router.push(callbackUrl);
        await refreshSession();
        router.refresh();
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
    <Card className="w-full mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl  ">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-gray-900" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          Sign in to your Ali Books account
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
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
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
              className="bg-white/5 border-white/20 mt-2 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#D5D502] hover:text-yellow-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-gradient-to-r from-yellow-500 to-[#D5D502] text-gray-900 hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 h-12 text-base font-semibold relative overflow-hidden group disabled:opacity-90 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3 relative z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="h-5 w-5" />
                </motion.div>
                <span>Signing in...</span>
              </div>
            ) : (
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative z-10"
              >
                Sign In
              </motion.span>
            )}

            {/* Shimmer effect during loading */}
            {loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-white/20">
          <p className="text-sm text-gray-400 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#D5D502] hover:text-yellow-400 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
      <CardContent className="p-8 text-center">
        <div className="flex items-center justify-center gap-3 text-gray-300">
          <RefreshCw className="h-12 w-12 animate-spin text-[#D5D502] mx-auto mb-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center sm:p-4">
      <Suspense fallback={<LoadingFallback />}>
        <SigninContent />
      </Suspense>
    </div>
  );
}
