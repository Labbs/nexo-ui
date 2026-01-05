import { MainLayout } from '@/components/layout/main-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiKeysSettings } from '@/components/settings/api-keys-settings'
import { WebhooksSettings } from '@/components/settings/webhooks-settings'
import { ActionsSettings } from '@/components/settings/actions-settings'
import { Key, Webhook, Zap, Settings as SettingsIcon } from 'lucide-react'

export function SettingsPage() {
  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and integrations.
              </p>
            </div>
          </div>

          <Tabs defaultValue="api-keys" className="space-y-6">
            <TabsList>
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="webhooks" className="flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>

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
