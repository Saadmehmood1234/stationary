
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center mb-2">
          <Mail className="h-10 w-10 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">
          Check Your Email
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg">
          We&apos;ve sent a verification link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-3">
          <p className="text-gray-300">
            Please check your inbox and click on the verification link to activate your account.
          </p>
          <p className="text-sm text-gray-400">
            The link will expire in 3 minutes for security reasons.
          </p>
        </div>

        {message === "check-email" && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-300">
              If you don&apos;t see the email, check your spam folder or request a new verification link.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full bg-gradient-to-r from-yellow-500 to-[#D5D502] text-white hover:shadow-lg hover:shadow-[#D5D502]/25 transition-all">
            <Link href="/">
              Go to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white">
            <Link href="/auth/signin">
              Back to Sign In
            </Link>
          </Button>
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
          <span>Loading...</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}