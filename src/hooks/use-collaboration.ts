import { useEffect, useRef, useState, useCallback } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from 'y-prosemirror'
import { useAuth } from '@/contexts/auth-context'

// Random color for cursor
const CURSOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
]

function getRandomColor() {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]
}

export interface CollaborationState {
  /** Y.js plugins to pass to editor.enableCollaboration() */
  plugins: ReturnType<typeof ySyncPlugin>[] | null
  /** The Y.js XML fragment used by ySyncPlugin */
  fragment: Y.XmlFragment | null
  /** Whether the websocket connection is established */
  isConnected: boolean
  /** Whether the initial sync from the server is complete */
  isSynced: boolean
  /** Number of connected users */
  connectedUsers: number
  /** List of connected users with their awareness info */
  users: CollaborationUser[]
}

export interface CollaborationUser {
  clientId: number
  name: string
  color: string
}

interface UseCollaborationOptions {
  /** Unique room identifier, e.g. "document:docId" or "row:databaseId:rowId" */
  roomId: string | undefined
  /** WebSocket server URL */
  wsUrl?: string
  /** Whether collaboration is enabled */
  enabled?: boolean
}

function buildCursor(user: { name?: string; color?: string }): HTMLElement {
  const name = user.name || 'Anonymous'
  const color = user.color || '#999'
  const initial = name[0].toUpperCase()

  const wrap = document.createElement('span')
  wrap.className = 'y-collab-cursor'
  wrap.style.setProperty('--collab-color', color)

  const avatar = document.createElement('span')
  avatar.className = 'y-collab-avatar'
  avatar.textContent = initial
  avatar.setAttribute('data-name', name)

  wrap.appendChild(avatar)
  return wrap
}

const DEFAULT_WS_URL = import.meta.env.VITE_COLLAB_WS_URL || (() => {
  if (import.meta.env.DEV) return 'ws://127.0.0.1:8080/ws/collab'
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${proto}//${window.location.host}/ws/collab`
})()

export function useCollaboration({
  roomId,
  wsUrl = DEFAULT_WS_URL,
  enabled = true,
}: UseCollaborationOptions): CollaborationState {
  const { user, token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [isSynced, setIsSynced] = useState(false)
  const [users, setUsers] = useState<CollaborationUser[]>([])

  const ydocRef = useRef<Y.Doc | null>(null)
  const providerRef = useRef<WebsocketProvider | null>(null)
  const pluginsRef = useRef<ReturnType<typeof ySyncPlugin>[] | null>(null)
  const fragmentRef = useRef<Y.XmlFragment | null>(null)
  const colorRef = useRef(getRandomColor())

  const cleanup = useCallback(() => {
    providerRef.current?.disconnect()
    providerRef.current?.destroy()
    ydocRef.current?.destroy()
    providerRef.current = null
    ydocRef.current = null
    pluginsRef.current = null
    fragmentRef.current = null
    setIsConnected(false)
    setIsSynced(false)
    setUsers([])
  }, [])

  useEffect(() => {
    if (!enabled || !roomId) {
      cleanup()
      return
    }

    // Create Y.js document
    const ydoc = new Y.Doc()
    ydocRef.current = ydoc

    // Connect to WebSocket server with auth token
    const provider = new WebsocketProvider(wsUrl, roomId, ydoc, {
      params: token ? { token } : {},
    })
    providerRef.current = provider

    // Set awareness (cursor info)
    provider.awareness.setLocalStateField('user', {
      name: user?.username || user?.email || 'Anonymous',
      color: colorRef.current,
    })

    // Build y-prosemirror plugins
    const fragment = ydoc.getXmlFragment('prosemirror')
    fragmentRef.current = fragment
    pluginsRef.current = [
      ySyncPlugin(fragment),
      yCursorPlugin(provider.awareness, { cursorBuilder: buildCursor }),
      yUndoPlugin(),
    ]

    // Connection status
    provider.on('status', ({ status }: { status: string }) => {
      setIsConnected(status === 'connected')
    })

    // Sync status
    provider.on('sync', (synced: boolean) => {
      setIsSynced(synced)
    })

    // Awareness changes (connected users)
    const updateUsers = () => {
      const states = provider.awareness.getStates()
      const collabUsers: CollaborationUser[] = []
      states.forEach((state, clientId) => {
        if (clientId === provider.awareness.clientID) return
        if (state.user) {
          collabUsers.push({
            clientId,
            name: state.user.name || 'Anonymous',
            color: state.user.color || '#999',
          })
        }
      })
      setUsers(collabUsers)
    }

    provider.awareness.on('change', updateUsers)
    updateUsers()

    return () => {
      provider.awareness.off('change', updateUsers)
      cleanup()
    }
  }, [roomId, wsUrl, enabled, token, user?.username, user?.email, cleanup])

  return {
    plugins: isConnected ? pluginsRef.current : null,
    fragment: isConnected ? fragmentRef.current : null,
    isConnected,
    isSynced,
    connectedUsers: users.length + 1, // +1 for self
    users,
  }
}
