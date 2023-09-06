import React, { useContext } from 'react'
import { type IProductsContext } from 'models/products'

const productsContext = React.createContext<IProductsContext>({
  mode: 'create',
  setMode: () => { },
  product: undefined,
  setProduct: () => { }
})

export const useProductsContext = (): IProductsContext => {
  const {
    mode,
    setMode,
    product,
    setProduct
  } = useContext(productsContext)

  return {
    mode,
    setMode,
    product,
    setProduct
  }
}

export const { Provider } = productsContext
export default productsContext
