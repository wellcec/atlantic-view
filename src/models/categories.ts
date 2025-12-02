import { type AxiosResponse } from 'axios'
import type IBaseResponseType from './base'

export interface SubCategoryType {
  uuid?: string
  uuidCategory?: string
  title: string
  createdDate?: Date
}

export interface CategoryType {
  uuid?: string
  title: string
  subCategories: SubCategoryType[]
  updatedDate?: Date
  createdDate?: Date
}

export interface CategoryResponseType {
  category: CategoryType
  subCategories: SubCategoryType[]
}

export interface IGetAllCategoriesResponse {
  data: CategoryType[]
  page: number
  pageSize: number
  count: number
}

export interface IResponseCreateCategory extends IBaseResponseType {
  result: CategoryType
}

export type GetAllCategoriesType = AxiosResponse<IGetAllCategoriesResponse, any>
