import { useCallback } from 'react'
import axios from 'axios'
import { IGetAllUsersResponse } from 'models/users'

const useUsersService = () => {
  const getUsers = useCallback(() => axios.get<IGetAllUsersResponse>('api/users'), [])

  return {
    getUsers,
  }
}

export default useUsersService