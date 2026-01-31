import { FileText, FolderKanban, type LucideIcon } from 'lucide-react'

export type AppId = 'docs' | 'projects'

export interface AppDefinition {
  id: AppId
  icon: LucideIcon
  label: string       // i18n key in 'navigation' namespace
  color: string       // Tailwind bg class
  comingSoon?: boolean
}

export const APP_REGISTRY: AppDefinition[] = [
  {
    id: 'docs',
    icon: FileText,
    label: 'apps.documents',
    color: 'bg-blue-500',
  },
  {
    id: 'projects',
    icon: FolderKanban,
    label: 'apps.projects',
    color: 'bg-purple-500',
    comingSoon: true,
  },
]

export function getAppDefinition(id: AppId): AppDefinition {
  return APP_REGISTRY.find((app) => app.id === id)!
}
