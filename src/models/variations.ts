export type VariationType = {
  id?: string,
  name: string,
  createdDate?: Date,
}

export interface IGetAllVariationsResponse {
  data: VariationType[]
  page: number
  pageSize: number
  count: number
}
