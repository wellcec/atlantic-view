import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import AppTheme from '~/layout/AppTheme'
import SwitchRoutes from '~/routes/SwitchRoutes'
import AxiosSettings from '~/helpers/Axios'
import { store, persist } from '~/shared/store'
import AlertsContext from '~/shared/alerts/AlertContext'
import { AlertType } from '~/models'
import Loader from '~/components/layout/Loader'
import Alerts from '~/components/layout/Alerts'

const App = () => {
  const [loading, setLoading] = useState<boolean>(false)

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
                onStartRequest={() => setLoading(true)}
                onStopRequest={() => setLoading(false)}
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
