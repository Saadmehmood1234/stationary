import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen dark:bg-[#181C14]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}