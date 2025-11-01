"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/app/actions/product.actions';
import { EditProductForm } from '@/components/EditProductForm';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading product...</span>
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