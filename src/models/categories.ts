export type SubCategoryType = {
  id?: string,
  name: string,
  createdDate?: Date,
}

export type CategoryType = {
  id?: string,
  name: string,
  subCategories: SubCategoryType[],
  createdDate?: Date,
}

export interface IGetAllCategoriesResponse {
  data: CategoryType[]
  page: number
  pageSize: number
  count: number
}
