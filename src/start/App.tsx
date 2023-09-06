import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import AppTheme from '~/layout/AppTheme'
import SwitchRoutes from '~/routes/SwitchRoutes'
import AxiosSettings from '~/helpers/Axios'
import { store, persist } from '~/shared/store'
import AlertsContext from '~/shared/alerts/AlertContext'
import { type AlertType } from '~/models'
import Loader from '~/components/layout/Loader'
import Alerts from '~/components/layout/Alerts'

const App = (): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [showLoading, setShowLoading] = useState<boolean>(true)

  const { Provider: ProviderAlerts } = AlertsContext
  const [alert, setAlert] = useState<AlertType>({ type: 'info', message: '' })

  return (
    <Provider store={store}>
      <PersistGate persistor={persist}>
        <AppTheme>
          <Loader show={loading} setLoading={setLoading} />

          <ProviderAlerts value={{ alert, setAlert }}>
            <BrowserRouter>
              <Alerts />

              <AxiosSettings
                handleShowLoading={(state) => { setShowLoading(state) }}
                onStartRequest={() => {
                  if (showLoading) setLoading(true)
                }}
                onStopRequest={() => { setLoading(false) }}
              />

              <SwitchRoutes />
            </BrowserRouter>
          </ProviderAlerts>
        </AppTheme>
      </PersistGate>
    </Provider>
  )
}

export default App
