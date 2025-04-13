import React from 'react'
import ReactDOM from 'react-dom/client'
import './start/index.css'
import ReactQueryProvider from './start/ReactQueryProvider'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Elemento #root não encontrado no DOM.')
}

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <ReactQueryProvider />
  // </React.StrictMode>
)
