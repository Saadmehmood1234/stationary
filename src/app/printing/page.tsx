'use client';

import { useState } from 'react';

export default function PrintingPage() {
  const printingPrices = [
    { type: 'Black & White (A4)', price: '₹2/page' },
    { type: 'Color (A4)', price: '₹10/page' },
    { type: 'Black & White (A3)', price: '₹5/page' },
    { type: 'Color (A3)', price: '₹20/page' },
    { type: 'Spiral Binding', price: '₹50-100' },
    { type: 'Lamination (A4)', price: '₹20/page' },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    printType: '',
    paperSize: 'A4',
    colorType: 'bw',
    pageCount: 1,
    binding: 'none',
    specialInstructions: '',
    urgency: 'normal'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Print request:', formData);
    setSubmitted(true);
    
    // Reset form and close modal after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        printType: '',
        paperSize: 'A4',
        colorType: 'bw',
        pageCount: 1,
        binding: 'none',
        specialInstructions: '',
        urgency: 'normal'
      });
      setSubmitted(false);
      setIsModalOpen(false);
    }, 3000);
  };

  const calculateEstimatedCost = () => {
    let cost = 0;
    const pageCount = formData.pageCount || 1;
    
    // Base printing cost
    if (formData.paperSize === 'A4') {
      cost += formData.colorType === 'color' ? 10 * pageCount : 2 * pageCount;
    } else if (formData.paperSize === 'A3') {
      cost += formData.colorType === 'color' ? 20 * pageCount : 5 * pageCount;
    }
    
    // Binding cost
    if (formData.binding === 'spiral') {
      cost += 50; // Minimum binding cost
    }
    
    return cost;
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSubmitted(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      printType: '',
      paperSize: 'A4',
      colorType: 'bw',
      pageCount: 1,
      binding: 'none',
      specialInstructions: '',
      urgency: 'normal'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Printing Services</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Professional printing services with quick turnaround. Request prints online or upload your files directly.
        </p>
        
        {/* Request Print Button */}
        <button
          onClick={openModal}
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
        >
          Request Print Online
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Process Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Request Print</h3>
                <p className="text-gray-600">
                  Fill out our online print request form or contact us directly.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Upload Files</h3>
                <p className="text-gray-600">
                  Send us your files via WhatsApp, Email, or bring them to the store.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">We Confirm & Print</h3>
                <p className="text-gray-600">
                  We'll confirm the price and estimated time, then proceed with printing.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Collect Your Order</h3>
                <p className="text-gray-600">
                  Pick up your printed materials from our store. We'll notify you when ready.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-4">Send Your Files</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/15551234567?text=Hello!%20I%20would%20like%20to%20get%20some%20printing%20done."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>📱</span>
                <span>Message on WhatsApp</span>
              </a>
              <a
                href="mailto:printing@inkwell.com?subject=Printing Request&body=Hello, I would like to get the following printed:"
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>✉️</span>
                <span>Email Your Files</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <div className="card">
            <div className="p-6">
              <div className="space-y-4">
                {printingPrices.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-gray-700">{item.type}</span>
                    <span className="font-semibold text-gray-900">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Note:</strong> Prices for special sizes and custom requirements available on request. 
                  Student discounts available!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Print Request Form</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-green-600">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
                  <p className="text-gray-600 mb-4">
                    We've received your print request. Please send your files via WhatsApp or Email, 
                    and we'll contact you shortly with confirmation.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p><strong>Estimated Cost:</strong> ₹{calculateEstimatedCost()}</p>
                    <p><strong>Next Step:</strong> Send your files to complete the request</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Print Specifications */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Print Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="paperSize" className="block text-sm font-medium text-gray-700 mb-1">
                          Paper Size *
                        </label>
                        <select
                          id="paperSize"
                          name="paperSize"
                          required
                          value={formData.paperSize}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="A4">A4</option>
                          <option value="A3">A3</option>
                          <option value="Letter">Letter</option>
                          <option value="Legal">Legal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="colorType" className="block text-sm font-medium text-gray-700 mb-1">
                          Color Type *
                        </label>
                        <select
                          id="colorType"
                          name="colorType"
                          required
                          value={formData.colorType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="bw">Black & White</option>
                          <option value="color">Color</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Pages *
                        </label>
                        <input
                          type="number"
                          id="pageCount"
                          name="pageCount"
                          required
                          min="1"
                          value={formData.pageCount}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="binding" className="block text-sm font-medium text-gray-700 mb-1">
                          Binding
                        </label>
                        <select
                          id="binding"
                          name="binding"
                          value={formData.binding}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="none">No Binding</option>
                          <option value="spiral">Spiral Binding</option>
                          <option value="stapler">Stapler</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                          Urgency
                        </label>
                        <select
                          id="urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="normal">Normal (24-48 hours)</option>
                          <option value="urgent">Urgent (Same day)</option>
                          <option value="express">Express (2-4 hours)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      rows={3}
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special requirements, file details, or additional instructions..."
                    />
                  </div>

                  {/* Cost Estimate */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Estimated Cost:</span>
                      <span className="text-xl font-bold text-blue-600">₹{calculateEstimatedCost()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      * Final cost may vary based on actual requirements
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 btn-secondary py-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary py-3"
                    >
                      Submit Print Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}