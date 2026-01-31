import { useTranslation } from 'react-i18next'
import { MainLayout } from '@/components/layout/main-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { ApiKeysSettings } from '@/components/settings/api-keys-settings'
import { WebhooksSettings } from '@/components/settings/webhooks-settings'
import { ActionsSettings } from '@/components/settings/actions-settings'
import { User, Key, Webhook, Zap, Settings as SettingsIcon } from 'lucide-react'

export function SettingsPage() {
  const { t } = useTranslation('settings')

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">{t('title')}</h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('tabs.profile')}
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                {t('tabs.apiKeys')}
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                {t('tabs.webhooks')}
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {t('tabs.actions')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="api-keys">
              <ApiKeysSettings />
            </TabsContent>

            <TabsContent value="webhooks">
              <WebhooksSettings />
            </TabsContent>

            <TabsContent value="actions">
              <ActionsSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}
