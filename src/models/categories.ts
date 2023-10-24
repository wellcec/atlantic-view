import { type AxiosResponse } from 'axios'

export interface SubCategoryType {
  _id: string
  name: string
  createdDate?: Date
}

export interface CategoryType {
  _id?: string
  name: string
  subCategories: SubCategoryType[]
  createdDate?: Date
}

export interface IGetAllCategoriesResponse {
  data: CategoryType[]
  page: number
  pageSize: number
  count: number
}

export type GetAllCategoriesType = AxiosResponse<IGetAllCategoriesResponse, any>
