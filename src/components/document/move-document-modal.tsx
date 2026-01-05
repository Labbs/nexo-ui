import { useEffect, useState } from 'react'
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
          <DialogTitle>Déplacer le document</DialogTitle>
          <DialogDescription>Sélectionnez un parent (ou laissez vide pour déplacer à la racine).</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="block text-sm font-medium mb-1">Parent (ID optionnel)</label>
            <Input value={parentId} onChange={(e) => setParentId(e.target.value)} placeholder="UUID du parent (optionnel)" />
            <p className="text-xs text-muted-foreground mt-1">Vous pouvez aussi cliquer un parent ci-dessous.</p>
          </div>

          <div className="max-h-56 overflow-auto border rounded p-2 space-y-1">
            {roots.map((doc: any) => (
              <button key={doc.id} className="w-full text-left px-2 py-1 rounded hover:bg-muted" onClick={() => setParentId(doc.id)}>
                {doc.name || 'Untitled'}
              </button>
            ))}
            {roots.length === 0 && <div className="text-sm text-muted-foreground">Aucun document racine</div>}
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Annuler</Button>
          <Button
            onClick={async () => {
              setError('')
              try {
                const pid = parentId.trim() || undefined
                await moveDocument({ spaceId, id: documentId, parentId: pid })
                show({ title: 'Document déplacé', variant: 'success' })
                onOpenChange(false)
              } catch (e: any) {
                setError(e?.response?.data?.details || 'Échec du déplacement')
                show({ title: 'Échec du déplacement', variant: 'destructive' })
              }
            }}
            disabled={isPending}
          >
            Déplacer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


