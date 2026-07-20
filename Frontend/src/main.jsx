import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './app/index.css'
import { router } from './app/app.routes.jsx'
import { AuthProvider } from './features/auth/store/auth.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

