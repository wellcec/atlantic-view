import React from 'react'
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { type StatusProductProps, type StatusProductType } from '~/models/products'
import { useProductsContext } from '../context'

interface IProps {
  statusProduct: StatusProductType
  setStatusProduct: (statusProduct: StatusProductType) => void
}

const FormStatus = ({ statusProduct, setStatusProduct }: IProps): React.JSX.Element => {
  const { product, setProduct } = useProductsContext()

  const handleChangeStatus = (checked: boolean, prop: StatusProductProps): void => {
    statusProduct[prop] = checked
    setStatusProduct({ ...statusProduct })
    setProduct({ ...product, status: { ...statusProduct } })
  }

  return (
    <FormGroup>
      <Box display="flex" flexWrap="wrap" justifyContent="start">
        <FormControlLabel
          control={<Checkbox checked={statusProduct.isLaunch} onChange={(_, checked) => { handleChangeStatus(checked, 'isLaunch') }} />}
          label="Lançamento"
        />
        <FormControlLabel
          control={<Checkbox checked={statusProduct.isSale} onChange={(_, checked) => { handleChangeStatus(checked, 'isSale') }} />}
          label="Promoção"
        />
        <FormControlLabel
          control={<Checkbox checked={statusProduct.isBestSeller} onChange={(_, checked) => { handleChangeStatus(checked, 'isBestSeller') }} />}
          label="Mais Vendidos"
        />
        <FormControlLabel
          control={<Checkbox checked={statusProduct.isPreOrder} onChange={(_, checked) => { handleChangeStatus(checked, 'isPreOrder') }} />}
          label="Pré-venda"
        />
      </Box>
    </FormGroup>
  )
}

export default FormStatus
