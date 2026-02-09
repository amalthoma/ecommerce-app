import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data))
  }, [id])

  const addToCart = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    await api.post('/cart/add', { product_id: product.id, quantity })
    navigate('/cart')
  }

  if (!product) return <p>Loading...</p>

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="h-96 overflow-hidden rounded-3xl bg-ink/5">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/40">No image</div>
        )}
      </div>
      <div>
        <h1 className="font-display text-4xl">{product.name}</h1>
        <p className="mt-3 text-ink/70">{product.description}</p>
        <div className="mt-6 flex items-center gap-6">
          <span className="text-3xl font-semibold">${product.price}</span>
          <span className="text-sm text-ink/50">Stock: {product.stock}</span>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 rounded-xl border border-ink/20 px-3 py-2"
          />
          <button onClick={addToCart} className="rounded-full bg-accent px-6 py-3 text-white">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
