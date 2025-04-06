import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './start/App'
import './start/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Elemento #root não encontrado no DOM.')
}

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
