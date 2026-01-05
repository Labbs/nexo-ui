import { createReactBlockSpec } from '@blocknote/react'
import { defaultProps } from '@blocknote/core'
import { Plus, MousePointerClick } from 'lucide-react'

// ============================================================================
// ACTION BUTTON BLOCK
// ============================================================================

export const ActionButton = createReactBlockSpec(
  {
    type: 'actionButton' as const,
    propSchema: {
      label: {
        default: 'Click me',
      },
      action: {
        default: 'newPage' as const,
      },
      url: {
        default: '',
      },
      variant: {
        default: 'primary' as const,
      },
    },
    content: 'none' as const,
  },
  {
    render: ({ block, editor }) => {
      const { label, action, variant } = block.props
      const isEditable = editor.isEditable

      const getVariantStyles = (): React.CSSProperties => {
        switch (variant) {
          case 'primary':
            return {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
            }
          case 'secondary':
            return {
              backgroundColor: 'hsl(var(--secondary))',
              color: 'hsl(var(--secondary-foreground))',
              border: 'none',
            }
          case 'outline':
            return {
              backgroundColor: 'transparent',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            }
          default:
            return {
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              border: 'none',
            }
        }
      }

      const handleClick = () => {
        if (!isEditable) {
          switch (action) {
            case 'newPage':
              window.dispatchEvent(
                new CustomEvent('blocknote:action', {
                  detail: { action: 'newPage', blockId: block.id },
                })
              )
              break
            case 'addTableEntry':
              window.dispatchEvent(
                new CustomEvent('blocknote:action', {
                  detail: { action: 'addTableEntry', blockId: block.id },
                })
              )
              break
            case 'custom':
              window.dispatchEvent(
                new CustomEvent('blocknote:action', {
                  detail: { action: 'custom', blockId: block.id, url: block.props.url },
                })
              )
              break
          }
        }
      }

      return (
        <div style={{ padding: '0.25rem 0' }}>
          <button
            onClick={handleClick}
            style={{
              ...getVariantStyles(),
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isEditable ? 'default' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'opacity 150ms ease',
            }}
            onMouseOver={(e) => {
              if (!isEditable) {
                e.currentTarget.style.opacity = '0.9'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {action === 'newPage' && <Plus size={16} />}
            {action === 'addTableEntry' && <Plus size={16} />}
            {action === 'custom' && <MousePointerClick size={16} />}
            {label}
          </button>
        </div>
      )
    },
  }
)

// ============================================================================
// CALLOUT BLOCK
// ============================================================================

export const Callout = createReactBlockSpec(
  {
    type: 'callout' as const,
    propSchema: {
      ...defaultProps,
      calloutType: {
        default: 'info' as const,
      },
      emoji: {
        default: '💡',
      },
    },
    content: 'inline' as const,
  },
  {
    render: ({ block, contentRef }) => {
      const { calloutType, emoji } = block.props

      const getTypeStyles = () => {
        switch (calloutType) {
          case 'info':
            return {
              backgroundColor: 'hsl(217 91% 60% / 0.1)',
              borderColor: 'hsl(217 91% 60% / 0.3)',
            }
          case 'warning':
            return {
              backgroundColor: 'hsl(45 93% 47% / 0.1)',
              borderColor: 'hsl(45 93% 47% / 0.3)',
            }
          case 'success':
            return {
              backgroundColor: 'hsl(142 71% 45% / 0.1)',
              borderColor: 'hsl(142 71% 45% / 0.3)',
            }
          case 'error':
            return {
              backgroundColor: 'hsl(0 84% 60% / 0.1)',
              borderColor: 'hsl(0 84% 60% / 0.3)',
            }
          default:
            return {
              backgroundColor: 'hsl(217 91% 60% / 0.1)',
              borderColor: 'hsl(217 91% 60% / 0.3)',
            }
        }
      }

      const styles = getTypeStyles()

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            border: `1px solid ${styles.borderColor}`,
            backgroundColor: styles.backgroundColor,
            margin: '0.25rem 0',
          }}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{emoji}</span>
          <div
            ref={contentRef}
            style={{
              flex: 1,
              minWidth: 0,
            }}
          />
        </div>
      )
    },
  }
)

// ============================================================================
// DIVIDER BLOCK
// ============================================================================

export const Divider = createReactBlockSpec(
  {
    type: 'divider' as const,
    propSchema: {
      dividerStyle: {
        default: 'solid' as const,
      },
    },
    content: 'none' as const,
  },
  {
    render: ({ block }) => {
      const { dividerStyle } = block.props

      return (
        <div style={{ padding: '0.75rem 0' }}>
          <hr
            style={{
              border: 'none',
              borderTop: `1px ${dividerStyle} hsl(var(--border))`,
              margin: 0,
            }}
          />
        </div>
      )
    },
  }
)

// ============================================================================
// SLASH MENU ITEMS FACTORY
// ============================================================================

export const getCustomSlashMenuItems = (editor: any) => [
  {
    title: 'Action Button',
    subtext: 'Add an interactive button',
    group: 'Other',
    icon: <MousePointerClick size={18} />,
    aliases: ['button', 'action', 'click'],
    onItemClick: () => {
      editor.insertBlocks(
        [{ type: 'actionButton', props: { label: 'New Page', action: 'newPage' } }],
        editor.getTextCursorPosition().block,
        'after'
      )
    },
  },
  {
    title: 'Callout',
    subtext: 'Highlight important information',
    group: 'Other',
    icon: <span style={{ fontSize: '18px' }}>💡</span>,
    aliases: ['callout', 'note', 'info', 'alert'],
    onItemClick: () => {
      editor.insertBlocks(
        [{ type: 'callout', props: { calloutType: 'info', emoji: '💡' } }],
        editor.getTextCursorPosition().block,
        'after'
      )
    },
  },
]
