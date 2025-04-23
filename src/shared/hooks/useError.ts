import { useCallback } from 'react'
import useAlerts from '../alerts/useAlerts'

interface IUseError {
  showErrorMsg: (err: any) => void
}

const useError = (): IUseError => {
  const { notifyError, notifyValidations } = useAlerts()

  const showErrorMsg = useCallback((err: any): void => {
    const { message = '', validations = [] } = err?.data ?? {}
    if (err?.status === 400) {
      notifyValidations(validations)
    } else {
      notifyError(message)
    }
  }, [notifyValidations, notifyError])

  return { showErrorMsg }
}

export default useError
