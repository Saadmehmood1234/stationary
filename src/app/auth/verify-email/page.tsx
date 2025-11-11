"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Book,
} from "lucide-react";


interface VerifyEmailResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

function VerifyEmailContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [message, setMessage] = useState("Verifying your email...");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setMessage("No verification token found in the URL.");
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.post<VerifyEmailResponse>(
          "/api/auth/verify-email",
          { token }
        );
        const data = response.data;

        if (data.success) {
          setMessage("Your email has been verified successfully!");
          setStatus("success");
          setTimeout(() => router.push("/auth/signin"), 3000);
        } else {
          setMessage(data.error || "Verification failed.");
          setStatus("error");
        }
      } catch (error: any) {
        console.error("Verification error:", error);

        if (error.response?.data) {
          const errorData = error.response.data as VerifyEmailResponse;
          setMessage(
            errorData.error || "Something went wrong. Please try again."
          );
        } else {
          setMessage("Something went wrong. Please try again.");
        }
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center mb-2">
          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <CheckCircle2 className="h-10 w-10 text-gray-900" />
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <AlertTriangle className="h-10 w-10 text-gray-900" />
            </motion.div>
          )}
          {status === "loading" && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            >
              <Loader2 className="h-10 w-10 text-gray-900" />
            </motion.div>
          )}
        </div>

        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
          {status === "success"
            ? "Email Verified!"
            : status === "error"
            ? "Verification Failed"
            : "Verifying Email"}
        </CardTitle>

        <CardDescription className="text-gray-300 text-lg">
          {message}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-center">
        <div className="space-y-3">
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300"
            >
              🎉 Welcome aboard! Your account is now active.
            </motion.p>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-gray-300">{message}</p>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-300">
                  Please request a new verification email from the sign-in page.
                </p>
              </div>
            </motion.div>
          )}

          {status === "loading" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300"
            >
              Please wait while we verify your email address...
            </motion.p>
          )}
        </div>

        <div className="space-y-3">
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <p className="text-sm text-green-300">
                Redirecting you to sign in page in a few seconds...
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <Button
              asChild
              className="w-full rounded-full text-gray-900 bg-gradient-to-r from-yellow-500 to-[#D5D502] hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all"
            >
              <Link href="/">
                Go to Homepage
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-white/20 text-gray-900  hover:bg-white/10 hover:text-white transition-all"
            >
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
          </motion.div>
        </div>

        <div className="pt-4 border-t border-white/20">
          <p className="text-sm text-gray-400">
            Need help?{" "}
            <Link href="/contact" className="text-[#D5D502] hover:underline">
              Contact support
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
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading verification...</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute top-10 left-10 opacity-20"
      >
        <Book size={48} className="text-[#D5D502]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, delay: 1 }}
        className="absolute bottom-10 right-10 opacity-20"
      >
        <Book size={48} className="text-[#D5D502] transform rotate-45" />
      </motion.div>

      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
