import { useState } from 'react'
import { Loader2, Table2, FileText, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateDatabase, type PropertySchema, type DatabaseType } from '@/hooks/use-database'
import { cn } from '@/lib/utils'

interface CreateDatabaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaceId: string
  documentId?: string
  onSuccess?: (databaseId: string) => void
}

// Default schema for spreadsheet databases
const spreadsheetDefaultSchema: PropertySchema[] = [
  {
    id: 'title',
    name: 'Name',
    type: 'title',
  },
  {
    id: 'status',
    name: 'Status',
    type: 'select',
    options: {
      options: [
        { id: 'not_started', name: 'Not started', color: 'gray' },
        { id: 'in_progress', name: 'In progress', color: 'blue' },
        { id: 'done', name: 'Done', color: 'green' },
      ],
    },
  },
]

// Default schema for document databases (just title)
const documentDefaultSchema: PropertySchema[] = [
  {
    id: 'title',
    name: 'Title',
    type: 'title',
  },
]

export function CreateDatabaseModal({
  open,
  onOpenChange,
  spaceId,
  documentId,
  onSuccess,
}: CreateDatabaseModalProps) {
  const [databaseType, setDatabaseType] = useState<DatabaseType>('spreadsheet')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('📊')

  const { mutateAsync: createDatabase, isPending } = useCreateDatabase()

  // Update icon when type changes
  const handleTypeChange = (type: DatabaseType) => {
    setDatabaseType(type)
    // Set default icon based on type
    if (type === 'spreadsheet' && icon === '📚') {
      setIcon('📊')
    } else if (type === 'document' && icon === '📊') {
      setIcon('📚')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const schema = databaseType === 'document' ? documentDefaultSchema : spreadsheetDefaultSchema
      const result = await createDatabase({
        spaceId,
        name: name.trim(),
        description: description.trim() || undefined,
        icon: icon || undefined,
        schema,
        documentId,
        type: databaseType,
      })

      // Reset form
      setDatabaseType('spreadsheet')
      setName('')
      setDescription('')
      setIcon('📊')
      onOpenChange(false)

      // Callback with new database ID
      if (result.id) {
        onSuccess?.(result.id)
      }
    } catch (error) {
      console.error('Failed to create database:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create database</DialogTitle>
            <DialogDescription>
              Create a new database to organize your data in tables, boards, and more.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Database type selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('spreadsheet')}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all outline-none focus:outline-none focus-visible:ring-0",
                  databaseType === 'spreadsheet'
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                )}
              >
                {databaseType === 'spreadsheet' && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <Table2 className={cn(
                  "h-8 w-8",
                  databaseType === 'spreadsheet' ? "text-primary" : "text-muted-foreground"
                )} />
                <div className="text-center">
                  <div className={cn(
                    "font-medium text-sm",
                    databaseType === 'spreadsheet' ? "text-primary" : "text-foreground"
                  )}>
                    Spreadsheet
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Data table with rows and columns
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('document')}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all outline-none focus:outline-none focus-visible:ring-0",
                  databaseType === 'document'
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
                )}
              >
                {databaseType === 'document' && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <FileText className={cn(
                  "h-8 w-8",
                  databaseType === 'document' ? "text-primary" : "text-muted-foreground"
                )} />
                <div className="text-center">
                  <div className={cn(
                    "font-medium text-sm",
                    databaseType === 'document' ? "text-primary" : "text-foreground"
                  )}>
                    Document
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Collection of documents with fields
                  </div>
                </div>
              </button>
            </div>

            {/* Icon and Name row */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-3xl hover:bg-accent rounded p-2 transition-colors shrink-0"
                onClick={() => {
                  const newIcon = prompt('Enter icon (emoji):', icon)
                  if (newIcon !== null) {
                    setIcon(newIcon)
                  }
                }}
              >
                {icon || '📊'}
              </button>
              <div className="flex-1">
                <Label htmlFor="name" className="sr-only">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Database name"
                  className="text-lg font-medium"
                  autoFocus
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="mt-1.5 resize-none"
                rows={2}
              />
            </div>

            {/* Info about default columns */}
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <p>Your database will be created with default columns:</p>
              <ul className="mt-2 space-y-1">
                {databaseType === 'spreadsheet' ? (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Name</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Title</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Status</span>
                      <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Select</span>
                    </li>
                  </>
                ) : (
                  <li className="flex items-center gap-2">
                    <span className="font-medium">Title</span>
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Title</span>
                  </li>
                )}
              </ul>
              <p className="mt-2">You can customize columns after creation.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create database
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
