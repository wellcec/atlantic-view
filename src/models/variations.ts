import { AxiosResponse } from 'axios'

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

export type GetAllVariationsType = AxiosResponse<IGetAllVariationsResponse, any>
