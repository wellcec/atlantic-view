import { type AxiosResponse } from 'axios'

export interface SubCategoryType {
  id?: string
  name: string
  createdDate?: Date
}

export interface CategoryType {
  id?: string
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
