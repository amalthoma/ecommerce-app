import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

const Products = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-4xl">Product Gallery</h1>
        <p className="mt-2 text-ink/70">Curated catalog with real inventory and pricing.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1"
          >
            <div className="h-40 w-full overflow-hidden rounded-xl bg-ink/5">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-ink/40">No image</div>
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
            <p className="mt-2 text-sm text-ink/70 line-clamp-2">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold">${product.price}</span>
              <span className="text-xs text-ink/50">Stock: {product.stock}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Products
