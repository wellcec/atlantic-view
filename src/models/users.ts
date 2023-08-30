import { AxiosResponse } from 'axios'

export type UserType = {
  id: string,
  name: string,
  document: string,
  createdDate: Date,
}

export interface IGetAllUsersResponse {
  data: UserType[]
  page: number
  pageSize: number
  count: number
}

export type GetAllUsersType = AxiosResponse<IGetAllUsersResponse, any>
