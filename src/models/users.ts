export type UserType = {
  id: string,
  name: string,
  document: string,
  createdDate: Date,
}

export interface IGetAllUsersRespnse {
  data: UserType[]
  page: number
  pageSize: number
  count: number
}
