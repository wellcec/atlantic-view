import React, { useContext } from 'react'
import { ALERT_TYPES, type IAlerts } from '~/models'

const defaultAlert: IAlerts = {
  alert: { type: ALERT_TYPES.info, message: '' },
  setAlert: () => { }
}

const AlertsContext = React.createContext(defaultAlert)

export const useAlertsContext = (): IAlerts => {
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
