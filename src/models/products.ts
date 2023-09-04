import { AxiosResponse } from 'axios'
import { CategoryType } from './categories'

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

export type StatusProductType = {
  isLaunch: boolean,
  isSale: boolean,
  isBestSeller: boolean,
  isPreOrder: boolean,
}

export type StatusProductProps = keyof StatusProductType

export type ProductType = {
  id: string,
  title: string;
  subtitle: string;
  value: number;
  valueUnique: number;
  weight: string;
  height: string;
  length: string;
  width: string;
  categories: CategoryType[];
  images: ImageType[];
  variations: VariantionType[];
  tags: TagType[];
  status: StatusProductType;
  createdDate: Date;
  updatedDate: Date;
}

export type CreateProductType = Omit<ProductType, 'id' | 'createdDate' | 'updatedDate'>

export interface IGetAllProductsResponse {
  data: ProductType[]
  page: number
  pageSize: number
  count: number
}

export type GetAllProductsType = AxiosResponse<IGetAllProductsResponse, any>

export interface IGetAllImagesResponse {
  data: ImageType[]
}

export interface IProductsContext {
  product: ProductType,
  setProduct: React.Dispatch<React.SetStateAction<ProductType>>,
  creating: boolean,
  setCreating: React.Dispatch<React.SetStateAction<boolean>>,
}
