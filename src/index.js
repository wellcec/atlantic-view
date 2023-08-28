import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import 'start/index.css'
import App from 'start/App'

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
