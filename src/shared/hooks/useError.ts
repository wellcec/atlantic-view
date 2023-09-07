import { useCallback } from 'react'
import { useAlerts } from '../alerts/AlertContext'

interface IUseError {
  showErrorMsg: (err: any) => void
}

const useError = (): IUseError => {
  const { setAlert } = useAlerts()

  const showErrorMsg = useCallback((err: any): void => {
    const { message } = err?.data ?? {}
    if (err?.status === 400) {
      setAlert({ type: 'warning', message })
    } else {
      setAlert({ type: 'error', message })
    }
  }, [setAlert])

  return { showErrorMsg }
}

export default useError
