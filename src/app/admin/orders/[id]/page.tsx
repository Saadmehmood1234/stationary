import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data - in real app, fetch from API based on ID
const mockOrder = {
  _id: '1',
  orderNumber: 'ORD-001',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0123'
  },
  items: [
    {
      productId: 'prod-1',
      name: 'Premium Gel Pen - Blue',
      sku: 'PEN-GEL-BLUE-07',
      quantity: 2,
      price: 3.99,
      total: 7.98
    },
    {
      productId: 'prod-2',
      name: 'A5 Lined Notebook',
      sku: 'NB-A5-LIN-120',
      quantity: 1,
      price: 8.99,
      total: 8.99
    }
  ],
  subtotal: 16.97,
  tax: 1.44,
  total: 18.41,
  status: 'pending',
  paymentStatus: 'paid',
  collectionMethod: 'pickup',
  notes: 'Please pack carefully. Customer prefers blue ink pens.',
  createdAt: new Date('2024-01-15T10:30:00'),
  updatedAt: new Date('2024-01-15T10:30:00')
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = mockOrder; // In real app, fetch by params.id

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/orders"
              className="text-gray-600 hover:text-gray-700"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="btn-secondary">Print</button>
          <button className="btn-primary">Update Status</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="font-semibold">${item.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="card">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Notes</h2>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection:</span>
                  <span className="font-medium capitalize">{order.collectionMethod}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {order.customer.name}</p>
                <p><strong>Email:</strong> {order.customer.email}</p>
                <p><strong>Phone:</strong> {order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Total</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}