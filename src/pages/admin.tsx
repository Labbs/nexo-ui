import { useTranslation } from 'react-i18next'
import { MainLayout } from '@/components/layout/main-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UsersManagement } from '@/components/admin/users-management'
import { GroupsManagement } from '@/components/admin/groups-management'
import { SpacesManagement } from '@/components/admin/spaces-management'
import { ApiKeysManagement } from '@/components/admin/apikeys-management'
import { SsoManagement } from '@/components/admin/sso-management'
import { User, Users, FolderOpen, Key, KeyRound, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Navigate } from 'react-router-dom'

export function AdminPage() {
  const { t } = useTranslation('admin')
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('common:loading')}</p>
        </div>
      </MainLayout>
    )
  }

  // Redirect non-admin users
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-6">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">{t('title')}</h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('tabs.users')}
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {t('tabs.groups')}
              </TabsTrigger>
              <TabsTrigger value="spaces" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                {t('tabs.spaces')}
              </TabsTrigger>
              <TabsTrigger value="apikeys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                {t('tabs.apiKeys')}
              </TabsTrigger>
              <TabsTrigger value="sso" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                {t('tabs.sso')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <UsersManagement />
            </TabsContent>

            <TabsContent value="groups">
              <GroupsManagement />
            </TabsContent>

            <TabsContent value="spaces">
              <SpacesManagement />
            </TabsContent>

            <TabsContent value="apikeys">
              <ApiKeysManagement />
            </TabsContent>

            <TabsContent value="sso">
              <SsoManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}
