import React, { useEffect } from 'react'
import axios from 'axios'

import useSecurity from '~/shared/hooks/useSecurity'
import { env } from '~/config/env'

axios.defaults.baseURL = env.api.API_BASE_URL

interface IProps {
  handleShowLoading: (loading: boolean) => void
}

const AxiosSettings = ({ handleShowLoading }: IProps): React.JSX.Element => {
  const {
    signout,
    getUser,
    getCredential
  } = useSecurity()

  const catchResponse = (response: any): Promise<never> => {
    return Promise.reject(response)
  }

  useEffect(() => {
    let token: string | null
    const requestId = axios.interceptors.request.use((config: any) => {
      const { noLoading = false } = config ?? {}
      handleShowLoading(!noLoading)

      const newConfig = { ...config }

      const { headers } = newConfig

      const t = getCredential()
      token = t
      // if (t) {
      headers.Authorization = `Bearer ${t}`
      // }

      return newConfig
    }, (error) => {
      return Promise.reject(error)
    })

    const responseId = axios.interceptors.response.use(
      (response) => {
        return response
      }, (error) => {
        let { response = {} } = error

        if (response.status === 401 && !token) {
          response = { ...response, data: { title: 'Sessão expirada!', message: 'Faça o login novamente!' } }
          signout()
        }

        if (response.status === 403) {
          response = { ...response, data: '' }
          signout()
        }

        if (response.status === 404) {
          response = { ...response, data: { title: response.status, message: 'Serviço Indisponível!' } }
        }

        if (response.status === 500) {
          response = {
            ...response,
            data: {
              title: `Erro Interno - ${response.status}`,
              message: 'Contate o administrador do sistema!'
            }
          }
        }

        return catchResponse(response)
      })

    return () => {
      axios.interceptors.request.eject(requestId)
      axios.interceptors.response.eject(responseId)
    }
  }, [getUser, signout, getCredential])

  return <></>
}

export default AxiosSettings
