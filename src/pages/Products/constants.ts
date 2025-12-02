import { type ProductType, type StatusProductType } from '~/models/products'

export const ShippingKeys = {
  free: 0,
  correios: 1
}

export const ShipingOptions = [
  {
    label: 'Grátis',
    key: ShippingKeys.free
  },
  {
    label: 'Correios',
    key: ShippingKeys.correios
  }
]

export const DefaultStatusProduct: StatusProductType = {
  isLaunch: false,
  isSale: false,
  isBestSeller: false,
  isPreOrder: false
}

export const DefaultProduct: ProductType = {
  title: '',
  subtitle: '',
  value: 0,
  valueUnique: 0,
  height: 0,
  length: 0,
  weight: 0,
  width: 0,
  shipping: ShippingKeys.free,
  status: DefaultStatusProduct,
  listTags: [],
  categories: [],
  variations: []
}
export default ShipingOptions
