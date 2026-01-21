import { useEffect, useRef, useCallback, useState } from 'react'
import {
  useOpenBlock,
  useCustomSlashMenuItems,
  OpenBlockView,
  SlashMenu,
  BubbleMenu,
  TableHandles,
  type Block,
} from '@labbs/openblock-react'
import { useTheme } from 'next-themes'
import { DatabaseBlock } from './database-block'

// Custom blocks array - add new custom blocks here
const CUSTOM_BLOCKS = [DatabaseBlock]

// Type pour un bloc OpenBlock
export interface OpenBlockBlock {
  id?: string
  type: string
  props?: Record<string, unknown>
  content?: Array<{
    type: string
    text?: string
    href?: string
    styles?: Record<string, boolean>
  }>
  children?: OpenBlockBlock[]
}

// Type pour le contenu (array de blocs)
export type OpenBlockContent = OpenBlockBlock[]

interface OpenBlockEditorProps {
  content: OpenBlockContent | null | undefined
  onChange: (content: OpenBlockContent) => void
  editable?: boolean
  fullWidth?: boolean
}

// Styles component to avoid duplication
function EditorStyles() {
  return (
    <style>{`
      .openblock-editor-wrapper {
        --ob-colors-editor-background: hsl(var(--background));
        --ob-colors-editor-text: hsl(var(--foreground));
        --ob-colors-menu-background: hsl(var(--popover));
        --ob-colors-menu-text: hsl(var(--popover-foreground));
        --ob-colors-tooltip-background: hsl(var(--popover));
        --ob-colors-tooltip-text: hsl(var(--popover-foreground));
        --ob-colors-hovered-background: hsl(var(--accent));
        --ob-colors-hovered-text: hsl(var(--accent-foreground));
        --ob-colors-selected-background: hsl(var(--secondary));
        --ob-colors-selected-text: hsl(var(--secondary-foreground));
        --ob-colors-disabled-background: hsl(var(--muted));
        --ob-colors-disabled-text: hsl(var(--muted-foreground));
        --ob-colors-border: hsl(var(--border));
        --ob-font-family: inherit;
      }

      .openblock-editor-wrapper .ProseMirror {
        padding: 1.5rem 2rem;
        min-height: 100%;
        max-width: 720px;
        margin: 0 auto;
        transition: max-width 0.2s ease;
      }

      .openblock-editor-wrapper.full-width .ProseMirror {
        max-width: 100%;
      }

      /* Headings - Notion style */
      .openblock-editor-wrapper [data-block-type="heading"][data-level="1"] {
        font-size: 1.875rem;
        font-weight: 700;
        line-height: 1.3;
        margin-top: 2rem;
        margin-bottom: 0.25rem;
      }

      .openblock-editor-wrapper [data-block-type="heading"][data-level="2"] {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.3;
        margin-top: 1.5rem;
        margin-bottom: 0.25rem;
      }

      .openblock-editor-wrapper [data-block-type="heading"][data-level="3"] {
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.3;
        margin-top: 1rem;
        margin-bottom: 0.25rem;
      }

      /* Paragraphs */
      .openblock-editor-wrapper [data-block-type="paragraph"] {
        line-height: 1.6;
      }

      /* Lists */
      .openblock-editor-wrapper [data-block-type="bulletList"],
      .openblock-editor-wrapper [data-block-type="orderedList"] {
        line-height: 1.5;
      }

      /* Code blocks */
      .openblock-editor-wrapper [data-block-type="codeBlock"] {
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
        font-size: 0.85rem;
        background: hsl(var(--secondary));
        color: hsl(var(--foreground));
        border-radius: 0.375rem;
        padding: 0.25rem 0.5rem;
        border: 1px solid hsl(var(--border));
      }

      .openblock-editor-wrapper [data-block-type="codeBlock"] code {
        color: hsl(var(--foreground));
        background: transparent;
      }

      /* Inline code */
      .openblock-editor-wrapper code:not([data-block-type="codeBlock"] code) {
        background: hsl(var(--secondary));
        color: hsl(var(--foreground));
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
      }

      /* Slash menu styling */
      .openblock-editor-wrapper .ob-slash-menu {
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 1px solid hsl(var(--border));
        max-height: 320px;
        overflow-y: auto;
      }

      .openblock-editor-wrapper .ob-slash-menu-item {
        padding: 0.5rem 0.75rem;
        border-radius: 0.25rem;
        transition: background-color 150ms ease;
      }

      .openblock-editor-wrapper .ob-slash-menu-item:hover {
        background: hsl(var(--accent));
      }

      /* Formatting toolbar */
      .openblock-editor-wrapper .ob-bubble-menu {
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        border: 1px solid hsl(var(--border));
      }

      /* Side menu (drag handle) */
      .openblock-editor-wrapper .ob-side-menu {
        opacity: 0;
        transition: opacity 150ms ease;
      }

      .openblock-editor-wrapper .ob-block:hover .ob-side-menu,
      .openblock-editor-wrapper .ob-side-menu:hover {
        opacity: 1;
      }

      /* Table styles */
      .openblock-editor-wrapper table {
        border-collapse: collapse;
        width: 100%;
      }

      .openblock-editor-wrapper td,
      .openblock-editor-wrapper th {
        border: 1px solid hsl(var(--border));
        padding: 0.5rem 0.75rem;
      }

      /* Placeholder text */
      .openblock-editor-wrapper .ob-placeholder::before {
        color: hsl(var(--muted-foreground));
        font-style: normal;
      }

      /* OpenBlock view container */
      .openblock-editor-wrapper .openblock-view {
        min-height: 400px;
      }

      .openblock-editor-wrapper .openblock-editor {
        min-height: 400px;
        padding: 1rem;
      }

      /* Force text visibility */
      .openblock-editor-wrapper .ProseMirror {
        color: hsl(var(--foreground));
        background: hsl(var(--background));
      }

      .openblock-editor-wrapper .ProseMirror p {
        margin: 0;
        padding: 3px 0;
      }
    `}</style>
  )
}

// Inner component that receives stable initialContent
function OpenBlockEditorInner({
  initialContent,
  onChange,
  editable,
  fullWidth,
}: {
  initialContent: Block[] | undefined
  onChange: (content: OpenBlockContent) => void
  editable: boolean
  fullWidth: boolean
}) {
  const { resolvedTheme } = useTheme()
  const lastContentRef = useRef<string>(JSON.stringify(initialContent || []))
  const isInitializedRef = useRef(true) // Already initialized with content

  // Create the editor with initial content
  const editor = useOpenBlock({
    initialContent,
    editable,
    placeholder: 'Type / for commands...',
    customBlocks: CUSTOM_BLOCKS,
  })

  // Get slash menu items from custom blocks
  const customSlashMenuItems = useCustomSlashMenuItems(editor, CUSTOM_BLOCKS)

  // Handle content changes
  const handleChange = useCallback(() => {
    if (!isInitializedRef.current || !editor || editor.isDestroyed) return

    const blocks = editor.getDocument()
    const jsonString = JSON.stringify(blocks)

    // Avoid infinite loops if content hasn't changed
    if (jsonString !== lastContentRef.current) {
      lastContentRef.current = jsonString
      onChange(blocks as OpenBlockContent)
    }
  }, [editor, onChange])

  // Subscribe to editor changes
  useEffect(() => {
    if (!editor || editor.isDestroyed) return

    const handleTransaction = () => {
      handleChange()
    }

    editor.on('transaction', handleTransaction)

    return () => {
      editor.off('transaction', handleTransaction)
    }
  }, [editor, handleChange])

  // Don't render if editor is not ready or destroyed
  if (!editor || editor.isDestroyed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  return (
    <div
      className={`openblock-editor-wrapper ${fullWidth ? 'full-width' : ''}`}
      style={{ backgroundColor: 'var(--main-bg)', minHeight: '400px', height: '100%', overflow: 'auto' }}
      data-theme={resolvedTheme}
    >
      <OpenBlockView editor={editor} className="openblock-view" />
      <SlashMenu editor={editor} additionalItems={customSlashMenuItems} />
      <BubbleMenu editor={editor} />
      <TableHandles editor={editor} />
      <EditorStyles />
    </div>
  )
}

// Wrapper component that waits for content to be available
export function OpenBlockEditor({
  content,
  onChange,
  editable = true,
  fullWidth = false,
}: OpenBlockEditorProps) {
  const [isReady, setIsReady] = useState(false)
  const initialContentRef = useRef<Block[] | undefined>(undefined)

  // Wait for content to be available before mounting the editor
  useEffect(() => {
    if (isReady) return // Already ready, don't re-initialize

    // If we have valid content, capture it and mark as ready
    if (content && Array.isArray(content) && content.length > 0) {
      initialContentRef.current = content as Block[]
      setIsReady(true)
    } else if (content !== undefined) {
      // Content is defined but empty - also ready (new document)
      initialContentRef.current = undefined
      setIsReady(true)
    }
  }, [content, isReady])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  return (
    <OpenBlockEditorInner
      initialContent={initialContentRef.current}
      onChange={onChange}
      editable={editable}
      fullWidth={fullWidth}
    />
  )
}

