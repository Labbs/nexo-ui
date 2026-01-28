import { useTranslation } from 'react-i18next'

interface SpaceContentProjectsProps {
  spaceId: string
  canEdit: boolean
}

export function SpaceContentProjects({ spaceId: _spaceId, canEdit: _canEdit }: SpaceContentProjectsProps) {
  const { t } = useTranslation('navigation')

  return (
    <div className="ml-4 pl-3 border-l border-border/50 py-2">
      <p className="text-xs text-muted-foreground px-2">
        {t('apps.projects')} — {t('common:loading')}
      </p>
    </div>
  )
}
