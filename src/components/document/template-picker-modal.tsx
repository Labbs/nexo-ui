import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Loader2, LayoutTemplate } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTemplates, useCreateDocumentFromTemplate } from '@/hooks/use-templates'
import { useCreateDocument } from '@/hooks/use-documents'
import { useToast } from '@/components/ui/toaster'
import { DocumentIcon, isEmoji } from '@/components/ui/icon-picker'
import { parseStoredIcon } from '@/lib/utils'
import type { Document } from '@/api/generated/model'

interface TemplatePickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  parentId?: string
}

export function TemplatePickerModal({
  open,
  onOpenChange,
  spaceId,
  parentId,
}: TemplatePickerModalProps) {
  const { t } = useTranslation('document')
  const navigate = useNavigate()
  const { show } = useToast()
  const { data: templates = [], isLoading } = useTemplates(spaceId)
  const { mutateAsync: createFromTemplate, isPending: isCreatingFromTemplate } = useCreateDocumentFromTemplate()
  const { mutateAsync: createBlank, isPending: isCreatingBlank } = useCreateDocument()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const isCreating = isCreatingFromTemplate || isCreatingBlank

  // Group templates by category
  const grouped = templates.reduce<Record<string, typeof templates>>((acc, tpl) => {
    const cat = tpl.template_category || t('templates.uncategorized')
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(tpl)
    return acc
  }, {})

  const handleUseTemplate = async (templateId: string) => {
    setSelectedId(templateId)
    try {
      const doc = await createFromTemplate({ spaceId, templateId, parentId })
      onOpenChange(false)
      if (doc.slug) navigate(`/space/${spaceId}/${doc.slug}`)
    } catch {
      show({ title: t('templates.createError'), variant: 'destructive' })
    } finally {
      setSelectedId(null)
    }
  }

  const handleBlank = async () => {
    try {
      const doc = await createBlank({ spaceId, parentId })
      onOpenChange(false)
      const slug = (doc as Document & { slug?: string }).slug
      if (slug) navigate(`/space/${spaceId}/${slug}`)
    } catch {
      show({ title: t('templates.createError'), variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            {t('templates.pickerTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
          {/* Blank document */}
          <div>
            <button
              onClick={handleBlank}
              disabled={isCreating}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary hover:bg-accent/50 transition-colors text-left group"
            >
              <div className="h-10 w-10 rounded-md border flex items-center justify-center shrink-0 bg-background group-hover:border-primary">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{t('templates.blankDocument')}</p>
                <p className="text-xs text-muted-foreground">{t('templates.blankDescription')}</p>
              </div>
            </button>
          </div>

          {/* Templates */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t('templates.empty')}
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {category}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {items.map((tpl) => {
                    const iconValue = parseStoredIcon(tpl.config.icon)
                    const showBg = isEmoji(iconValue) || !iconValue
                    const isLoading = selectedId === tpl.id

                    return (
                      <button
                        key={tpl.id}
                        onClick={() => handleUseTemplate(tpl.id)}
                        disabled={isCreating}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-colors text-left group"
                      >
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-xs shrink-0"
                          style={{ backgroundColor: showBg ? '#6366f1' : 'transparent', color: showBg ? 'white' : undefined }}
                        >
                          {iconValue
                            ? <DocumentIcon value={iconValue} size="sm" />
                            : <FileText className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{tpl.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{tpl.space_name}</p>
                        </div>
                        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            {t('templates.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
