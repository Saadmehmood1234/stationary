// app/auth/verify-email/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-[#FDC700] rounded-full flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-[#027068]" />
        </div>
        <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
        <CardDescription className="text-lg">
          We&apos;ve sent a verification link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-gray-600">
            Please check your inbox and click on the verification link to activate your account.
          </p>
          <p className="text-sm text-gray-500">
            The link will expire in 3 minutes for security reasons.
          </p>
        </div>

        {message === "check-email" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              If you don&apos;t see the email, check your spam folder or request a new verification link.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full bg-[#027068] hover:bg-[#025e56]">
            <Link href="/">
              Go to Homepage
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signin">
              Back to Sign In
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/contact" className="text-[#027068] hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}