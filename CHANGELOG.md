# Changelog - Nexo UI

## [2.0.3] - 2025-10-24

### Fixed

- **DropdownMenu Transparency**: Fixed transparent background in user profile dropdown menu
  - Added inline styles to `DropdownMenuContent` to force opaque background
  - Same fix as Dialog and Tooltip (workaround for TailwindCSS v4)
  - User menu now clearly visible in both light and dark modes

- **Space Auto-Selection**: Implemented automatic space selection on first login
  - Created `useAutoSelectSpace` hook with intelligent selection logic
  - Priority: Saved space in localStorage → "Private" space → First available space
  - New users now see their "Private" space selected automatically
  - Returning users see their last used space restored
  - Integrated in HomePage component

### Changed

- **SpacesSidebar UI**: Removed redundant user avatar from bottom of spaces sidebar
  - User profile is already accessible via dropdown in main sidebar
  - Cleaner, more focused space navigation
  - Removed unused `useAuth` import from component

## [2.0.2] - 2025-10-24

### Fixed

- **Dialog & Tooltip Transparency**: Fixed transparent backgrounds in modals and tooltips
  - Added inline styles to `DialogContent` to force opaque background
  - Added inline styles to `TooltipContent` to force opaque background
  - Both components now properly display with `--popover` and `--background` CSS variables
  - Workaround for TailwindCSS v4 not generating some custom utility classes
  - Dialog and tooltips now clearly visible in both light and dark modes

## [2.0.1] - 2025-10-24

### Fixed

- **CreateSpace API Integration**: Now sends `icon` and `iconColor` to backend
  - Updated `useCreateSpace` hook to accept icon and iconColor parameters
  - Updated `CreateSpaceModal` to pass selected emoji and color to API
  - Regenerated TypeScript types from updated OpenAPI spec
  - Spaces now persist with custom icons and colors! 🎨

## [2.0.0] - 2025-10-24

### Major UI Redesign - Double Sidebar (Slack-style)

#### Added

**New Components:**
- `SpacesSidebar` - Left sidebar with space icons (72px wide)
  - Vertical icon list with tooltips
  - Active space indicator (colored left border)
  - Create space button
  - User avatar at bottom
  - Smooth transitions and hover effects

- `SpaceIcon` - Reusable space icon component
  - Configurable sizes (sm, md, lg)
  - Support for emoji icons and custom colors
  - Hover scale animation

- `MobileHeader` - Mobile-optimized header
  - Hamburger menu toggle
  - Space switcher dropdown
  - User avatar
  - Only visible on screens < 1024px

- `CreateSpaceModal` - Modal for creating new spaces
  - Name input with validation
  - Emoji picker (16 common emojis)
  - Color picker (8 predefined colors)
  - Live preview
  - Radix Dialog integration

**New UI Components (Radix):**
- `Tooltip` - Hover tooltips for space icons
- `Dialog` - Modal dialogs (used for space creation)
- `Separator` - Horizontal/vertical separators

**New Hooks:**
- `useMediaQuery` - Responsive breakpoint detection
  - SSR-safe
  - Supports modern and legacy browsers
  - Used for desktop/mobile layout switching

#### Changed

**Layout System:**
- `MainLayout` - Complete rewrite for responsive double sidebar
  - **Desktop (≥1024px):** Double sidebar layout
    - SpacesSidebar (72px) + Sidebar (256px) + Content
  - **Mobile (<1024px):** Header + overlay sidebar
    - MobileHeader + Sliding sidebar + Content
  - Backdrop overlay for mobile sidebar
  - Smooth slide-in/out transitions

- `Sidebar` - Major refactoring
  - Removed SpaceSwitcher from top
  - Added space name header (desktop only)
  - Added close button (mobile only)
  - Split user menu (desktop dropdown vs mobile list)
  - Accepts `onClose` prop for mobile overlay
  - Responsive height (h-full instead of h-screen)

**Space Management:**
- Space switching now in left sidebar (desktop)
- One-click space change (vs 2-click dropdown)
- Visual space identification with icons/colors
- Better scalability for multiple spaces

#### Technical Improvements

- **Performance:** Memoization-ready components
- **Accessibility:** ARIA labels, keyboard navigation, proper focus management
- **Responsive:** Breakpoint-based layout with smooth transitions
- **Touch-friendly:** 44px minimum touch targets on mobile
- **Bundle size:** +25KB (~400KB → ~425KB, ~135KB gzipped)

#### Design Inspiration

- Primary: Slack/Discord (double sidebar with icons)
- Secondary: Notion (clean, minimal aesthetic)
- Result: Modern, professional, scalable workspace UI

### Migration Guide

**Breaking Changes:**
- `MainLayout` no longer accepts layout props
- `Sidebar` requires `onClose` prop when used as overlay
- `SpaceSwitcher` removed from Sidebar (now in SpacesSidebar)

**New Dependencies:**
- `@radix-ui/react-tooltip` - Tooltip component
- `@radix-ui/react-separator` - Separator component

**No API Changes:**
- All existing API integrations remain unchanged
- CreateSpace API still only accepts `name` (icon/color UI-only)

### Screenshots

**Desktop View:**
```
┌────┬────────────────────┬─────────────────┐
│ 🏠 │ Personal        ▾  │                 │
│────│────────────────────│                 │
│ 💼 │ ★ Favorites        │                 │
│    │   • Doc 1          │   CONTENT       │
│ 🎨 │ 📄 Pages           │                 │
│    │   • Doc 2          │                 │
│ 📚 │                    │                 │
│ 👤 │ User Menu          │                 │
└────┴────────────────────┴─────────────────┘
 72px    256px
```

**Mobile View:**
```
┌──────────────────────────┐
│ ☰  Personal  ▾  [user]   │ ← Header
├──────────────────────────┤
│                          │
│        CONTENT           │
│                          │
└──────────────────────────┘
```

### Testing

- ✅ Build successful (425KB, 135KB gzipped)
- ✅ TypeScript compilation successful
- ✅ No console errors in dev mode
- ✅ Responsive breakpoints working
- ✅ Mobile sidebar slide animation smooth
- ✅ Space creation modal functional
- ✅ Tooltip interactions working

### Known Limitations

- Icon/color selection in CreateSpaceModal is UI-only
  - Backend API doesn't support icon/iconColor yet
  - Will be integrated when API is updated
- Space creation requires minimum 3 characters
- Maximum 100 characters for space names

### Next Steps

1. Update backend API to accept icon/iconColor
2. Add space editing functionality
3. Add space deletion with confirmation
4. Implement document routing and pages
5. Add Tiptap editor integration

