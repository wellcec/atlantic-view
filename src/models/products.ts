export type ProductType = {
  id: string,
  name: string,
  description: string,
  createdDate: Date,
}

export type ImageType = {
  id: string,
  fileName: string,
  base64: string,
  createdDate: Date,
}

export type TagType = {
  id?: string,
  name: string,
}

export type VariantionType = {
  id?: string,
  name: string,
}

export interface IGetAllProductsResponse {
  data: ProductType[]
  page: number
  pageSize: number
  count: number
}

export interface IGetAllImagesResponse {
  data: ImageType[]
}

export interface IProductsContext {
  product: ProductType,
  setProduct: React.Dispatch<React.SetStateAction<ProductType>>,
  creating: boolean,
  setCreating: React.Dispatch<React.SetStateAction<boolean>>,
}
