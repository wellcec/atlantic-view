import React, { useContext } from 'react'
import { IAlerts } from 'models'

const defaultAlert: IAlerts = {
  alert: { type: 'info', message: '' },
  setAlert: () => { },
}

const AlertsContext = React.createContext(defaultAlert)

export const useAlerts = () => {
  const {
    alert,
    setAlert,
  } = useContext(AlertsContext)

  return {
    alert,
    setAlert,
  }
}

export default AlertsContext
