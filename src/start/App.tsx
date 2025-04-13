import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

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
  const [enableLoading, setEnableLoading] = useState<boolean>(true)

  const { Provider: ProviderAlerts } = AlertsContext
  const [alert, setAlert] = useState<AlertType>({ type: 'info', message: '' })

  // Glocal loading
  const isFetchingGlobal = useIsFetching({
    predicate: (query) => {
      return query.queryKey?.[0] !== 'local-only'
    }
  })

  const isMutatingGlobal = useIsMutating({
    predicate: (mutation) => {
      return mutation.options.mutationKey?.[0] !== 'local-only'
    }
  })

  useEffect(() => {
    const showLoading = isFetchingGlobal > 0 || isMutatingGlobal > 0
    setLoading(showLoading)
  }, [isFetchingGlobal, isMutatingGlobal])

  return (
    <Provider store={store}>
      <PersistGate persistor={persist}>
        <AppTheme>

          <Loader show={loading} setLoading={setLoading} />

          <ProviderAlerts value={{ alert, setAlert }}>
            <BrowserRouter>
              <Alerts />

              <AxiosSettings
                handleShowLoading={(state) => { setEnableLoading(state) }}
                onStartRequest={() => {
                  if (enableLoading) {
                    // setLoading(true)
                  }
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
