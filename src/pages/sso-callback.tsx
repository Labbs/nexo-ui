import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

export function SSOCallbackPage() {
  const [searchParams] = useSearchParams()
  const { loginWithSSOToken } = useAuth()
  const navigate = useNavigate()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error || !code || !state) {
      navigate('/login?error=sso_failed', { replace: true })
      return
    }

    loginWithSSOToken(code, state)
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login?error=sso_failed', { replace: true }))
  }, [searchParams, loginWithSSOToken, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
