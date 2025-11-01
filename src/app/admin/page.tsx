import Link from 'next/link';
import { Package, Clock, DollarSign, AlertTriangle, TrendingUp, Plus, FileText, Layers } from 'lucide-react';

const dashboardStats = {
  totalOrders: 124,
  pendingOrders: 12,
  totalRevenue: 5423.50,
  totalProducts: 89,
  lowStockProducts: 5,
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', amount: 45.99, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 23.50, status: 'ready', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 67.25, status: 'completed', date: '2024-01-14' },
  ],
  popularProducts: [
    { name: 'Premium Gel Pen', sales: 45 },
    { name: 'A5 Lined Notebook', sales: 38 },
    { name: 'Art Marker Set', sales: 22 },
  ]
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-400 mt-3 text-lg">Overview of your stationery store</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D5D502]/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-full border border-blue-500/30">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.totalOrders}</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-full border border-yellow-500/30">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.pendingOrders}</p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-full border border-green-500/30">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹{dashboardStats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-red-500/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Low Stock</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.lowStockProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
                <Link href="/admin/orders" className="text-[#D5D502] hover:text-yellow-400 text-sm transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardStats.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                    <div>
                      <p className="font-medium text-white">{order.id}</p>
                      <p className="text-sm text-gray-400">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">₹{order.amount}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        order.status === 'ready' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Popular Products</h2>
                <Link href="/admin/products" className="text-[#D5D502] hover:text-yellow-400 text-sm transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardStats.popularProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500 to-[#D5D502] text-white' :
                        index === 1 ? 'bg-gray-500 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="font-medium text-white">{product.name}</span>
                    </div>
                    <span className="text-gray-400">{product.sales} sales</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/products/create"
                className="p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-[#D5D502] hover:bg-[#D5D502]/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-[#D5D502] rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-white">Add Product</p>
                <p className="text-sm text-gray-400">Create new product</p>
              </Link>
              
              <Link
                href="/admin/orders"
                className="p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-green-500 hover:bg-green-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-white">Manage Orders</p>
                <p className="text-sm text-gray-400">View all orders</p>
              </Link>
              
              <Link
                href="/admin/products"
                className="p-6 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium text-white">Inventory</p>
                <p className="text-sm text-gray-400">Manage stock</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}