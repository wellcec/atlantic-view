import React, { useState } from 'react'
import { MODES, type Mode, type ProductType } from '~/models/products'
import { Provider } from './context'
import New from './new'
import List from './list'

const Products = (): React.JSX.Element => {
  const { create, update, list } = MODES

  const [product, setProduct] = useState<ProductType | undefined>()
  const [mode, setMode] = useState<Mode>(list)

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
          {(mode === create || mode === update) && (<New />)}
          {(mode === list) && (<List />)}
        </>
      </Provider>
    </>
  )
}

export default Products
