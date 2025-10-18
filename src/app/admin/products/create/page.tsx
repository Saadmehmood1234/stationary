'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types';

// Mock categories - in real app, fetch from API
const categories = [
  { id: 'pens-writing', name: 'Pens & Writing' },
  { id: 'notebooks', name: 'Notebooks' },
  { id: 'art-supplies', name: 'Art Supplies' },
  { id: 'office-supplies', name: 'Office Supplies' }
];

const subcategories = {
  'pens-writing': ['gel-pens', 'ballpoint-pens', 'fountain-pens', 'markers', 'highlighters'],
  'notebooks': ['lined-notebooks', 'blank-notebooks', 'grid-notebooks', 'dot-grid', 'journals'],
  'art-supplies': ['markers', 'paints', 'brushes', 'sketchbooks', 'colored-pencils'],
  'office-supplies': ['files-folders', 'staplers', 'tape', 'clips', 'organizers']
};

const brands = ['InkWell', 'PaperCraft', 'ArtPro', 'WriteRight', 'StudioSeries'];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState('');

  const [formData, setFormData] = useState({
    // Basic Information
    sku: '',
    name: '',
    description: '',
    shortDescription: '',
    
    // Pricing
    price: 0,
    comparePrice: 0,
    costPrice: 0,
    
    // Inventory
    stock: 0,
    lowStockAlert: 10,
    trackQuantity: true,
    
    // Category & Organization
    category: '',
    subcategory: '',
    tags: [] as string[],
    brand: '',
    
    // Specifications
    specifications: {
      color: '',
      material: '',
      size: '',
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      penType: '',
      inkColor: '',
      pointSize: '',
      paperType: '',
      pageCount: 0,
      binding: ''
    },
    
    // Status & Flags
    status: 'active' as 'active' | 'inactive' | 'out_of_stock' | 'discontinued',
    isFeatured: false,
    isBestSeller: false,
    
    // SEO
    slug: '',
    metaTitle: '',
    metaDescription: ''
  });

  const [tagInput, setTagInput] = useState('');

  // Handle form input changes
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  
  if (name.startsWith('specifications.')) {
    const specField = name.replace('specifications.', '');
    
    if (specField.includes('.')) {
      const [parent, child] = specField.split('.');
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [parent]: {
            // Create a new object for the nested property instead of spreading
            ...(prev.specifications[parent as keyof typeof prev.specifications] as any),
            [child]: type === 'number' ? parseFloat(value) || 0 : value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    }
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }
};
  // Handle tag management
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle image management
  const handleAddImage = (url: string) => {
    if (url.trim() && !images.includes(url.trim())) {
      const newImages = [...images, url.trim()];
      setImages(newImages);
      if (!primaryImage) {
        setPrimaryImage(url.trim());
      }
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    const newImages = images.filter(img => img !== imageToRemove);
    setImages(newImages);
    if (primaryImage === imageToRemove) {
      setPrimaryImage(newImages[0] || '');
    }
  };

  // Handle variant management
  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      sku: `${formData.sku}-VAR-${variants.length + 1}`,
      name: `${formData.name} - Variant ${variants.length + 1}`,
      price: formData.price,
      stock: 0,
      attributes: {}
    };
    setVariants([...variants, newVariant]);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    if (field.startsWith('attributes.')) {
      const attrField = field.replace('attributes.', '');
      updatedVariants[index] = {
        ...updatedVariants[index],
        attributes: {
          ...updatedVariants[index].attributes,
          [attrField]: value
        }
      };
    } else {
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value
      };
    }
    setVariants(updatedVariants);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        images,
        primaryImage,
        hasVariants,
        variants: hasVariants ? variants : [],
        viewCount: 0,
        sellCount: 0
      };

      // In a real application, you would send this to your API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your stationery store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Auto-generate slug when name changes
                      if (!formData.slug) {
                        setFormData(prev => ({
                          ...prev,
                          slug: generateSlug(e.target.value)
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Premium Gel Pen - Blue"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    id="sku"
                    name="sku"
                    required
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., PEN-GEL-BLUE-07"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    required
                    rows={2}
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description for product listings"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Detailed product description with features and benefits"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Cost Price ($) *
                  </label>
                  <input
                    type="number"
                    id="costPrice"
                    name="costPrice"
                    required
                    min="0"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="comparePrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Compare Price ($)
                  </label>
                  <input
                    type="number"
                    id="comparePrice"
                    name="comparePrice"
                    min="0"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="lowStockAlert" className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Alert
                  </label>
                  <input
                    type="number"
                    id="lowStockAlert"
                    name="lowStockAlert"
                    min="0"
                    value={formData.lowStockAlert}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="trackQuantity"
                      checked={formData.trackQuantity}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Track Quantity</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Category & Organization Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Category & Organization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!formData.category}
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category && subcategories[formData.category as keyof typeof subcategories]?.map(sub => (
                      <option key={sub} value={sub}>
                        {sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <select
                    id="brand"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add tags..."
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Product Images</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Image URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      id="imageUrl"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage((e.target as HTMLInputElement).value), (e.target as HTMLInputElement).value = '')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('imageUrl') as HTMLInputElement;
                        handleAddImage(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Add Image
                    </button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images ({images.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                              <span className="text-gray-600 text-sm">Image {index + 1}</span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => setPrimaryImage(image)}
                              className={`p-1 rounded ${
                                primaryImage === image ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
                              }`}
                              title="Set as primary"
                            >
                              ★
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image)}
                              className="p-1 bg-red-500 text-white rounded"
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                          {primaryImage === image && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Specifications Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Product Specifications</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="specifications.color" className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    id="specifications.color"
                    name="specifications.color"
                    value={formData.specifications.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blue, Black, Red"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.material" className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    id="specifications.material"
                    name="specifications.material"
                    value={formData.specifications.material}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Plastic, Metal, Paper"
                  />
                </div>

                {/* Stationery Specific Fields */}
                <div>
                  <label htmlFor="specifications.penType" className="block text-sm font-medium text-gray-700 mb-2">
                    Pen Type
                  </label>
                  <select
                    id="specifications.penType"
                    name="specifications.penType"
                    value={formData.specifications.penType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Pen Type</option>
                    <option value="ballpoint">Ballpoint</option>
                    <option value="gel">Gel</option>
                    <option value="fountain">Fountain</option>
                    <option value="marker">Marker</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="specifications.inkColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Ink Color
                  </label>
                  <input
                    type="text"
                    id="specifications.inkColor"
                    name="specifications.inkColor"
                    value={formData.specifications.inkColor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Blue, Black, Red"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.pointSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Point Size
                  </label>
                  <input
                    type="text"
                    id="specifications.pointSize"
                    name="specifications.pointSize"
                    value={formData.specifications.pointSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 0.7mm, 1.0mm"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.paperType" className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Type
                  </label>
                  <select
                    id="specifications.paperType"
                    name="specifications.paperType"
                    value={formData.specifications.paperType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Paper Type</option>
                    <option value="lined">Lined</option>
                    <option value="blank">Blank</option>
                    <option value="grid">Grid</option>
                    <option value="dot">Dot Grid</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="specifications.pageCount" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Count
                  </label>
                  <input
                    type="number"
                    id="specifications.pageCount"
                    name="specifications.pageCount"
                    min="0"
                    value={formData.specifications.pageCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="specifications.binding" className="block text-sm font-medium text-gray-700 mb-2">
                    Binding Type
                  </label>
                  <select
                    id="specifications.binding"
                    name="specifications.binding"
                    value={formData.specifications.binding}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Binding</option>
                    <option value="spiral">Spiral</option>
                    <option value="perfect">Perfect</option>
                    <option value="hardcover">Hardcover</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Card */}
          <div className="card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Product Variants</h2>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">This product has variants</span>
                </label>
              </div>

              {hasVariants && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="btn-secondary"
                  >
                    + Add Variant
                  </button>

                  {variants.map((variant, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Variant {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            SKU
                          </label>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Variant Attributes (e.g., Color: Blue, Size: A4)
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Attribute name (e.g., Color)"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  const valueInput = target.nextElementSibling as HTMLInputElement;
                                  if (target.value && valueInput.value) {
                                    handleVariantChange(index, `attributes.${target.value}`, valueInput.value);
                                    target.value = '';
                                    valueInput.value = '';
                                  }
                                }
                              }}
                            />
                            <input
                              type="text"
                              placeholder="Attribute value (e.g., Blue)"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  const nameInput = target.previousElementSibling as HTMLInputElement;
                                  if (nameInput.value && target.value) {
                                    handleVariantChange(index, `attributes.${nameInput.value}`, target.value);
                                    nameInput.value = '';
                                    target.value = '';
                                  }
                                }
                              }}
                            />
                          </div>
                          
                          {Object.keys(variant.attributes).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(variant.attributes).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {key}: {value}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newAttributes = { ...variant.attributes };
                                      delete newAttributes[key];
                                      handleVariantChange(index, 'attributes', newAttributes);
                                    }}
                                    className="ml-2 hover:text-gray-600"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SEO & Status Card */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">SEO & Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="premium-gel-pen-blue"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    rows={3}
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SEO description for search engines"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Best Seller</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}