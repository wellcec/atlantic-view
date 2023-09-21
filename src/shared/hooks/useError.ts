import { useCallback } from 'react'
import useAlerts from '../alerts/useAlerts'

interface IUseError {
  showErrorMsg: (err: any) => void
}

const useError = (): IUseError => {
  const { notifyError, notifyWarning } = useAlerts()

  const showErrorMsg = useCallback((err: any): void => {
    const { message } = err?.data ?? {}
    if (err?.status === 400) {
      notifyWarning(message)
    } else {
      notifyError(message)
    }
  }, [notifyWarning, notifyError])

  return { showErrorMsg }
}

export default useError
