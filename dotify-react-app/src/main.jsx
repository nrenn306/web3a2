/**
 * main entry point for app
 * sets up all the providers... routing, auth context, strict mode for dev
 */

// react and DOM rendering
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// routing
import { BrowserRouter } from 'react-router-dom'

// styles
import './index.css'

// core App component
import App from './App.jsx'

// authentication context provider
import { AuthProvider } from './context/AuthContext'

/**
 * render the app with all the wrappers we need
 * BrowserRouter handles navigation, AuthProvider manages user auth state
 */
// createRoot finds the root element in index.html and creates a React root there
// .render() mounts the entire component tree starting with StrictMode
createRoot(document.getElementById('root')).render(
  // StrictMode - catches potential issues during development, logs warnings
  <StrictMode>
    {/* BrowserRouter - enables all route navigation between pages */}
    <BrowserRouter>
      {/* AuthProvider - wraps app with auth context so any component can check login status */}
      <AuthProvider>
        {/* App - the main component, contains all our pages and layout */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
