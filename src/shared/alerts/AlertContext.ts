import React, { useContext } from 'react'
import { type IAlerts } from 'models'

const defaultAlert: IAlerts = {
  alert: { type: 'info', message: '' },
  setAlert: () => { }
}

const AlertsContext = React.createContext(defaultAlert)

export const useAlerts = (): IAlerts => {
  const {
    alert,
    setAlert
  } = useContext(AlertsContext)

  return {
    alert,
    setAlert
  }
}

export default AlertsContext
