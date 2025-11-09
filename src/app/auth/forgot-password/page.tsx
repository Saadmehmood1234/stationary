"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, CheckCircle, Key } from "lucide-react";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center sm:p-4">
        <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg">
              Password reset link sent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-gray-300">
                If an account with <strong className="text-white">{email}</strong> exists, we've sent a password reset link.
              </p>
              <p className="text-sm text-gray-400">
                The link will expire in 1 hour for security reasons.
              </p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                <Link href="/auth/signin">
                  Back to Sign In
                </Link>
              </Button>
              
              <Button asChild variant="outline"  className="w-full rounded-full border-white/20 text-gray-900 hover:bg-white/10 hover:text-white">
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center sm:p-4">
      <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center">
            <Key className="h-8 w-8 text-gray-900" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email to receive a password reset link
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
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-white/5 my-2 border-white/20 text-white placeholder-gray-400 focus:border-[#D5D502] focus:ring-[#D5D502]/20"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-[#D5D502] text-graay-900 rounded-full cursor-pointer hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all duration-300 h-12 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-white/20 text-center">
            <Button asChild variant="ghost" className="text-[#D5D502] hover:text-yellow-400 hover:rounded-full hover:bg-white/5">
              <Link href="/auth/signin" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}