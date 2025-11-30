"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/app/actions/product.actions';
import { EditProductForm } from '@/components/EditProductForm';
import { Product } from '@/types';
import { Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.id;
      
      if (!productId) {
        setError('Product ID not found');
        setLoading(false);
        return;
      }

      // If it's an array, take the first element, otherwise use the string
      const id = Array.isArray(productId) ? productId[0] : productId;

      try {
        setLoading(true);
        const result = await getProductById(id);
        
        if (result.success && result.product) {
          setProduct(result.product);
        } else {
          setError(result.error || 'Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 bg-[#D5D502] rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "30%", left: "10%" }}
          />
          <motion.div
            className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "60%", right: "15%" }}
          />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#D5D502] rounded-full opacity-40"
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Animated Icon Container */}
            <motion.div
              className="relative mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-[#D5D502]/20 to-[#c4c400]/10 rounded-full border border-[#D5D502]/30 flex items-center justify-center mx-auto shadow-2xl shadow-[#D5D502]/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="h-10 w-10 text-[#D5D502]" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#D5D502] bg-clip-text text-transparent mb-4">
                Loading Products
              </h2>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Preparing your products for edit...
              </p>

              {/* Progress Bar */}
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#D5D502] to-[#c4c400]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-2 mt-6">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-[#D5D502] rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 p-8 max-w-md w-full mx-4 text-center">
          <div className="text-red-400 text-lg font-semibold mb-4">
            Error: {error || 'Product not found'}
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-yellow-500 to-[#D5D502] text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 py-8">
      <div className="container mx-auto px-4">
        <EditProductForm product={product} />
      </div>
    </div>
  );
}