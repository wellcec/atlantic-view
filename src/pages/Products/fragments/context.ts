import React, { useContext } from 'react'
import { IProductsContext } from 'models/products'

const productsContext = React.createContext<IProductsContext | null>(null)

export const useProducts = () => {
  const {
    creating,
    setCreating,
    product,
    setProduct,
  } = useContext(productsContext)

  return {
    creating,
    setCreating,
    product,
    setProduct,
  }
}

export const { Provider } = productsContext
export default productsContext
