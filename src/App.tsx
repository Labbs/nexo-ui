import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/contexts/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { SpaceProvider } from '@/contexts/space-context'
import { UIStateProvider } from '@/contexts/ui-state-context'
import { ActiveAppProvider } from '@/contexts/active-app-context'
import { ProtectedRoute } from '@/components/protected-route'
import { ToasterProvider } from '@/components/ui/toaster'
import { Loader2 } from 'lucide-react'

import '@/i18n'

// Lazy-loaded pages — only loaded when the route is visited
const LoginPage = lazy(() => import('@/pages/login').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/register').then(m => ({ default: m.RegisterPage })))
const HomePage = lazy(() => import('@/pages/home').then(m => ({ default: m.HomePage })))
const DocumentPage = lazy(() => import('@/pages/document').then(m => ({ default: m.DocumentPage })))
const DatabasePage = lazy(() => import('@/pages/database').then(m => ({ default: m.DatabasePage })))
const DatabaseDocumentPage = lazy(() => import('@/pages/database-document').then(m => ({ default: m.DatabaseDocumentPage })))
const DrawingPage = lazy(() => import('@/pages/drawing').then(m => ({ default: m.DrawingPage })))
const SettingsPage = lazy(() => import('@/pages/settings').then(m => ({ default: m.SettingsPage })))
const AdminPage = lazy(() => import('@/pages/admin').then(m => ({ default: m.AdminPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

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
              <Suspense fallback={<PageLoader />}>
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
              </Suspense>
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
