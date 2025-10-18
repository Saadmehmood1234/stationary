// app/admin/layout.tsx - Enhanced version
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Dashboard - InkWell Stationery',
  description: 'Manage your stationery store',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                InkWell Admin
              </Link>
              <nav className="flex space-x-6">
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Products
                </Link>
                <Link href="/admin/orders" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Orders
                </Link>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  View Store
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
            </div>
          </div>
        </div>
      </header>
      
      {children}
    </div>
  );
}