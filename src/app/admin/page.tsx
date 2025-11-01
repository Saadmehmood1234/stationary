import Link from 'next/link';

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your stationery store</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{dashboardStats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.lowStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardStats.recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.amount}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Popular Products</h2>
              <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {dashboardStats.popularProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <span className="text-gray-600">{product.sales} sales</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/products/create"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl mb-2 block">➕</span>
              <p className="font-medium">Add Product</p>
              <p className="text-sm text-gray-600">Create new product</p>
            </Link>
            
            <Link
              href="/admin/orders"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <span className="text-2xl mb-2 block">📋</span>
              <p className="font-medium">Manage Orders</p>
              <p className="text-sm text-gray-600">View all orders</p>
            </Link>
            
            <Link
              href="/admin/products"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <span className="text-2xl mb-2 block">📦</span>
              <p className="font-medium">Inventory</p>
              <p className="text-sm text-gray-600">Manage stock</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}