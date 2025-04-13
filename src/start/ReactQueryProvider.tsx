import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import App from './App'

const ReactQueryProvider = (): React.JSX.Element => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

export default ReactQueryProvider
