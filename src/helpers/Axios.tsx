import React, { useEffect, useState } from 'react'
import axios from 'axios'

import useSecurity from '~/shared/hooks/useSecurity'
import { env } from '~/config/env'

axios.defaults.baseURL = env.api.API_BASE_URL

interface IProps {
  handleShowLoading: (loading: boolean) => void
  onStopRequest: () => void
  onStartRequest: () => void
}

const AxiosSettings = ({ onStopRequest: stopRequest, onStartRequest: startRequest, handleShowLoading }: IProps): React.JSX.Element => {
  const {
    signout,
    getUser,
    getCredential
  } = useSecurity()
  const [count, setCount] = useState(0)

  const catchResponse = (response: any): Promise<never> => {
    setCount((current) => current - 1)
    return Promise.reject(response)
  }

  useEffect(() => {
    let token: string | null
    const requestId = axios.interceptors.request.use((config: any) => {
      const { noLoading = false } = config ?? {}
      handleShowLoading(!noLoading)
      setCount((current) => current + 1)

      const newConfig = { ...config }

      const { headers } = newConfig

      const t = getCredential()
      token = t
      // if (t) {
      headers.Authorization = `Bearer ${t}`
      // }

      return newConfig
    }, (error) => {
      setCount((current) => current - 1)
      return Promise.reject(error)
    })

    const responseId = axios.interceptors.response.use((response) => {
      setCount((current) => current - 1)
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

  useEffect(() => {
    if (count === 1) {
      setTimeout(() => {
        startRequest()
      }, 1000)
    }

    if (count === 0) {
      stopRequest()
    }
  }, [count, startRequest, stopRequest])

  return <></>
}

export default AxiosSettings
