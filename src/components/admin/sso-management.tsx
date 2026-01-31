import { useTranslation } from 'react-i18next'
import { KeyRound } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function SsoManagement() {
  const { t } = useTranslation('admin')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('sso.title')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('sso.description')}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <KeyRound className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('sso.comingSoon')}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('sso.comingSoonDescription')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
