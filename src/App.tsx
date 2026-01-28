import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/contexts/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { SpaceProvider } from '@/contexts/space-context'
import { UIStateProvider } from '@/contexts/ui-state-context'
import { ActiveAppProvider } from '@/contexts/active-app-context'
import { ProtectedRoute } from '@/components/protected-route'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { HomePage } from '@/pages/home'
import { DocumentPage } from '@/pages/document'
import { DatabasePage } from '@/pages/database'
import { DatabaseDocumentPage } from '@/pages/database-document'
import { DrawingPage } from '@/pages/drawing'
import { SettingsPage } from '@/pages/settings'
import { AdminPage } from '@/pages/admin'
import { ToasterProvider } from '@/components/ui/toaster'

import '@/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
            <SpaceProvider>
              <UIStateProvider>
              <ActiveAppProvider>
              <ToasterProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/space/:spaceId/:slug"
                  element={
                    <ProtectedRoute>
                      <DocumentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/space/:spaceId/database/:databaseId"
                  element={
                    <ProtectedRoute>
                      <DatabasePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/space/:spaceId/database/:databaseId/doc/:rowId"
                  element={
                    <ProtectedRoute>
                      <DatabaseDocumentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/space/:spaceId/drawing/:drawingId"
                  element={
                    <ProtectedRoute>
                      <DrawingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </ToasterProvider>
              </ActiveAppProvider>
              </UIStateProvider>
            </SpaceProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
