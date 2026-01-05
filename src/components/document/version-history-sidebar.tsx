import { X, History, RotateCcw, Loader2, GitCompare } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useVersions, useRestoreVersion, type VersionItem } from '@/hooks/use-versions'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface VersionHistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  spaceId?: string
  documentId?: string
  onCompare?: (versionId: string) => void
  comparingVersionId?: string | null
}

export function VersionHistorySidebar({
  isOpen,
  onClose,
  spaceId,
  documentId,
  onCompare,
  comparingVersionId,
}: VersionHistorySidebarProps) {
  // Only fetch when sidebar is open
  const { data, isLoading } = useVersions(spaceId, documentId, { enabled: isOpen })
  const { mutateAsync: restoreVersion } = useRestoreVersion()
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const handleRestore = async (version: VersionItem) => {
    if (!spaceId || !documentId) return
    if (!window.confirm(`Restore to version ${version.version}? Current changes will be saved as a new version.`)) return

    setRestoringId(version.id)
    try {
      await restoreVersion({ spaceId, documentId, versionId: version.id })
      // Page will refresh with new content via query invalidation
    } catch (error) {
      console.error('Failed to restore version:', error)
    } finally {
      setRestoringId(null)
    }
  }

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-80 border-l transition-transform duration-200 ease-in-out z-40',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{
        backgroundColor: 'hsl(var(--sidebar))',
      }}
    >
      <div className="flex flex-col h-full w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <h2 className="font-semibold">Version History</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !data?.versions || data.versions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No versions yet</p>
              <p className="text-xs mt-1">Versions are created automatically when you save changes.</p>
            </div>
          ) : (
            <div className="divide-y">
              {data.versions.map((version) => (
                <VersionListItem
                  key={version.id}
                  version={version}
                  onRestore={() => handleRestore(version)}
                  onCompare={() => onCompare?.(version.id)}
                  isRestoring={restoringId === version.id}
                  isComparing={comparingVersionId === version.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {data?.total_count && data.total_count > 0 && (
          <>
            <Separator />
            <div className="p-3 text-xs text-muted-foreground text-center">
              {data.total_count} version{data.total_count > 1 ? 's' : ''} total
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface VersionListItemProps {
  version: VersionItem
  onRestore: () => void
  onCompare: () => void
  isRestoring: boolean
  isComparing: boolean
}

function VersionListItem({ version, onRestore, onCompare, isRestoring, isComparing }: VersionListItemProps) {
  const timeAgo = formatDistanceToNow(new Date(version.created_at), {
    addSuffix: true,
    locale: fr,
  })

  return (
    <div className={cn(
      'p-3 hover:bg-accent/50 transition-colors group',
      isComparing && 'bg-accent/30 border-l-2 border-primary'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">v{version.version}</span>
            {version.name && (
              <span className="text-sm text-muted-foreground truncate">{version.name}</span>
            )}
            {isComparing && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">Comparing</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {version.user_name} • {timeAgo}
          </div>
          {version.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {version.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant={isComparing ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={onCompare}
            title={isComparing ? 'Stop comparing' : 'Compare with current'}
          >
            <GitCompare className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onRestore}
            disabled={isRestoring}
            title="Restore this version"
          >
            {isRestoring ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
