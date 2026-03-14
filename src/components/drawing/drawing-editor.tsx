import { useCallback, useEffect, useRef, useState } from 'react'
import { Excalidraw, exportToBlob } from '@excalidraw/excalidraw'
import type { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types'
import type { AppState, BinaryFiles, ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types'
import { useDebouncedCallback } from 'use-debounce'
import { useUpdateDrawing, type Drawing } from '@/hooks/use-drawings'
import { useTheme } from 'next-themes'
import { useToast } from '@/components/ui/toaster'

interface DrawingEditorProps {
  drawing: Drawing
}

export function DrawingEditor({ drawing }: DrawingEditorProps) {
  const [, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const { mutateAsync: updateDrawing } = useUpdateDrawing()
  const { theme } = useTheme()
  const { show: showToast } = useToast()
  const isReadyToSaveRef = useRef(false)

  // Store drawing id in ref to avoid stale closure
  const drawingIdRef = useRef(drawing.id)
  drawingIdRef.current = drawing.id

  // Track last saved elements to detect real changes
  const lastSavedElementsRef = useRef<string>(JSON.stringify(drawing.elements || []))

  // Delay enabling saves to skip initial onChange calls from Excalidraw
  useEffect(() => {
    const timer = setTimeout(() => {
      isReadyToSaveRef.current = true
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Save function (called by debounced handler)
  const saveDrawing = useCallback(
    async (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      // Generate thumbnail
      let thumbnail: string | undefined
      if (elements.length > 0) {
        try {
          const blob = await exportToBlob({
            elements: elements as ExcalidrawElement[],
            appState: {
              ...appState,
              exportBackground: true,
            },
            files,
            maxWidthOrHeight: 300,
          })
          thumbnail = await blobToBase64(blob)
        } catch (e) {
          console.error('Failed to generate thumbnail:', e)
        }
      }

      // Clean appState before saving (remove non-serializable properties)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { collaborators: _, ...cleanedAppState } = appState as unknown as Record<string, unknown>

      const elementsJson = JSON.stringify(elements)

      // Save to backend - only update lastSavedElementsRef on success
      try {
        await updateDrawing({
          drawingId: drawingIdRef.current,
          elements: elements as unknown[],
          appState: cleanedAppState,
          files: files as Record<string, unknown>,
          thumbnail,
        })
        lastSavedElementsRef.current = elementsJson
      } catch (e) {
        console.error('Failed to save drawing:', e)
        showToast({
          title: 'Failed to save drawing',
          description: 'Your changes could not be saved. They will be retried on next change.',
          variant: 'destructive',
        })
      }
    },
    [updateDrawing, showToast]
  )

  // Debounced save - only triggers after 300ms of inactivity
  const debouncedSave = useDebouncedCallback(saveDrawing, 300)

  // Handle changes from Excalidraw
  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      // Skip initial onChange calls during component initialization
      if (!isReadyToSaveRef.current) {
        return
      }

      // Only save if elements actually changed (ignore cursor/selection changes)
      const currentElements = JSON.stringify(elements)
      if (currentElements === lastSavedElementsRef.current) {
        return
      }

      debouncedSave(elements, appState, files)
    },
    [debouncedSave]
  )

  // Flush pending saves on unmount and browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      debouncedSave.flush()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      debouncedSave.flush()
    }
  }, [debouncedSave])

  // Clean appState to remove problematic properties that can't be serialized/deserialized properly
  const cleanAppState = (appState: Record<string, unknown> | undefined): Partial<AppState> => {
    if (!appState) return { theme: theme === 'dark' ? 'dark' : 'light' }
    // Remove collaborators as it needs to be a Map, not an object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { collaborators, ...rest } = appState
    return {
      ...rest,
      theme: theme === 'dark' ? 'dark' : 'light',
    } as Partial<AppState>
  }

  return (
    <div className="h-full w-full isolate [&_label[title='Library']]:hidden">
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          elements: (drawing.elements || []) as ExcalidrawElement[],
          appState: cleanAppState(drawing.app_state as Record<string, unknown>),
          files: (drawing.files || {}) as BinaryFiles,
        }}
        onChange={handleChange}
        theme={theme === 'dark' ? 'dark' : 'light'}
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: { saveFileToDisk: true },
          },
        }}
      />
    </div>
  )
}

// Helper to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert blob to base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
