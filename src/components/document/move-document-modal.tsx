import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDocuments, useMoveDocument } from '@/hooks/use-documents'
import { useToast } from '@/components/ui/toaster'

interface MoveDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  documentId: string
}

export function MoveDocumentModal({ open, onOpenChange, spaceId, documentId }: MoveDocumentModalProps) {
  const { t } = useTranslation('document')
  const { data: roots = [] } = useDocuments(spaceId)
  const { mutateAsync: moveDocument, isPending } = useMoveDocument()
  const [parentId, setParentId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const { show } = useToast()

  useEffect(() => {
    if (!open) {
      setParentId('')
      setError('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('moveDocument.title')}</DialogTitle>
          <DialogDescription>{t('moveDocument.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="block text-sm font-medium mb-1">{t('moveDocument.parentLabel')}</label>
            <Input value={parentId} onChange={(e) => setParentId(e.target.value)} placeholder={t('moveDocument.parentPlaceholder')} />
            <p className="text-xs text-muted-foreground mt-1">{t('moveDocument.parentHint')}</p>
          </div>

          <div className="max-h-56 overflow-auto border rounded p-2 space-y-1">
            {roots.map((doc) => (
              <button key={doc.id} className="w-full text-left px-2 py-1 rounded hover:bg-muted" onClick={() => setParentId(doc.id ?? '')}>
                {doc.name || t('common:untitled')}
              </button>
            ))}
            {roots.length === 0 && <div className="text-sm text-muted-foreground">{t('moveDocument.noRootDocuments')}</div>}
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>{t('common:cancel')}</Button>
          <Button
            onClick={async () => {
              setError('')
              try {
                const pid = parentId.trim() || undefined
                await moveDocument({ spaceId, id: documentId, parentId: pid })
                show({ title: t('moveDocument.moved'), variant: 'success' })
                onOpenChange(false)
              } catch (e: unknown) {
                const axiosErr = e as { response?: { data?: { details?: string } } }
                setError(axiosErr?.response?.data?.details || t('moveDocument.moveFailed'))
                show({ title: t('moveDocument.moveFailed'), variant: 'destructive' })
              }
            }}
            disabled={isPending}
          >
            {t('moveDocument.move')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


