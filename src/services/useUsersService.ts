import { useCallback } from 'react'
import axios from 'axios'
import { IGetAllUsersRespnse } from 'models/users'

const useUsersService = () => {
  const getUsers = useCallback(() => axios.get<IGetAllUsersRespnse>('api/users'), [])

  return {
    getUsers,
  }
}

export default useUsersService
