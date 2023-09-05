import React, { useState } from 'react'
import { ProductType } from 'models/products'
import { Provider } from './fragments/context'
import New from './new'
import List from './List'

const Products = () => {
  const [product, setProduct] = useState<ProductType | undefined>()
  const [creating, setCreating] = useState<boolean>(false)

  return (
    <>
      <Provider value={{
        product,
        setProduct,
        creating,
        setCreating,
      }}
      >
        <>
          {creating && (<New />)}
          {!creating && (<List />)}
        </>
      </Provider>
    </>
  )
}

export default Products
