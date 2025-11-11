import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}