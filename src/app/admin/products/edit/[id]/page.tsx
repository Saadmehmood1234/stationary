import { getProductById } from '@/app/actions/product.actions'
import EditProductForm from '@/components/EditProductForm'
import { Product, ProductFormData } from '@/types'
interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const result = await getProductById(params.id)

  if (!result.success || !result.product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600">Error: {result.error || 'Product not found'}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EditProductForm product={result.product as Product} />
    </div>
  )
}