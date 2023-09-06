import React, { useState } from 'react'
import { type Mode, type ProductType } from 'models/products'
import { Provider } from './fragments/context'
import New from './new'
import List from './List'

const Products = (): React.JSX.Element => {
  const [product, setProduct] = useState<ProductType | undefined>()
  const [mode, setMode] = useState<Mode>('list')

  return (
    <>
      <Provider value={{
        product,
        setProduct,
        mode,
        setMode
      }}
      >
        <>
          {(mode === 'create' || mode === 'update') && (<New />)}
          {(mode === 'list') && (<List />)}
        </>
      </Provider>
    </>
  )
}

export default Products
