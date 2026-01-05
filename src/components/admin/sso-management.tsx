import { KeyRound } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function SsoManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Single Sign-On</h3>
        <p className="text-sm text-muted-foreground">
          Configure SSO and LDAP authentication.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <KeyRound className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">SSO configuration coming soon</p>
          <p className="text-sm text-muted-foreground mt-2">
            You'll be able to configure SAML, OAuth, and LDAP authentication providers.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
