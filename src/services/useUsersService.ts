import { useCallback } from 'react'
import axios, { type AxiosResponse } from 'axios'
import { type IGetAllUsersResponse } from 'models/users'

interface IUsersService {
  getUsers: () => Promise<AxiosResponse<IGetAllUsersResponse, any>>
}

const useUsersService = (): IUsersService => {
  const getUsers = useCallback(() => axios.get<IGetAllUsersResponse>('api/users'), [])

  return {
    getUsers
  }
}

export default useUsersService
