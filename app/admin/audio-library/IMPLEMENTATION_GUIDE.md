# Audio Library Implementation Guide

## Overview

A complete, production-ready Frontend Admin UI for managing audio files in the hoccungbe system. Includes upload, list, preview, and edit capabilities.

## File Structure

```
app/admin/audio-library/
├── page.tsx                      # Main page with tabs (List/Upload)
├── layout.tsx                    # Layout wrapper
├── types.ts                      # TypeScript interfaces
├── AUDIO_LIBRARY_README.md      # Detailed documentation
├── IMPLEMENTATION_GUIDE.md      # This file
├── AudioLibrary.module.css      # Custom styles
├── components/
│   ├── AudioUploadForm.tsx      # Upload form with validation
│   ├── AudioList.tsx            # List with search/sort/pagination
│   ├── AudioPreviewModal.tsx    # Audio player modal
│   └── AudioEditModal.tsx       # Edit metadata modal
├── hooks/
│   └── useAudioLibrary.ts       # Custom hook for API calls
└── utils/
    └── audioHelpers.ts          # Helper functions
```

## Key Files

### 1. Page Entry (`page.tsx`)

**Purpose**: Main page component with tab navigation

**Features**:
- Two tabs: "Danh Sách" (List) and "Tải Lên" (Upload)
- Breadcrumb navigation
- Tab state management
- Auto-refresh list after upload

**Usage**:
```ts
// Automatically added to admin sidebar
// Accessible at: /admin/audio-library
```

### 2. Upload Component (`components/AudioUploadForm.tsx`)

**Purpose**: Handle audio file uploads

**Features**:
- Drag-and-drop upload area
- File validation (type & size)
- Title & description fields
- Form validation with error messages
- Loading states
- Success notifications

**Client-Side Validation**:
- Title: 3-255 characters
- File: MP3, WAV, M4A (max 50MB)

### 3. List Component (`components/AudioList.tsx`)

**Purpose**: Display and manage audio files

**Features**:
- Search by title/description (real-time)
- Sort by title or creation date
- Pagination (10 items per page)
- Status badges
- Preview, Edit, Delete actions
- Loading skeletons

### 4. Preview Modal (`components/AudioPreviewModal.tsx`)

**Purpose**: View audio with metadata

**Features**:
- HTML5 audio player
- Display duration, file size, format, status
- Download button
- Responsive modal

### 5. Edit Modal (`components/AudioEditModal.tsx`)

**Purpose**: Edit metadata or delete

**Features**:
- Edit title and description
- Read-only file info
- Delete with confirmation
- Error handling

### 6. Custom Hook (`hooks/useAudioLibrary.ts`)

**Purpose**: API integration layer

**Methods**:
```ts
const {
  fetchAudios(options)     // GET /api/audios
  uploadAudio(data)        // POST /api/audios (FormData)
  updateAudio(id, data)    // PUT /api/audios/{id}
  deleteAudio(id)          // DELETE /api/audios/{id}
  searchAudios(query)      // GET /api/audios/search
  isLoading                // Global loading state
  isUploading              // Upload loading state
  isDeleting               // Delete loading state
  error                    // Error message
} = useAudioLibrary()
```

### 7. Helper Functions (`utils/audioHelpers.ts`)

```ts
formatFileSize(bytes)           // 1024 → "1.0 KB"
formatDuration(seconds)         // 125 → "2:05"
validateAudioFile(file, limit)  // Returns { valid, error }
validateTitle(title)            // Returns { valid, error }
getFileExtension(filename)      // "song.mp3" → ".mp3"
```

### 8. Types (`types.ts`)

```ts
interface Audio {
  id: string
  title: string
  description?: string
  file_path: string
  duration: number
  file_size: number
  mime_type: string
  status: 'active' | 'deleted'
  created_at: string
  updated_at: string
}
```

## Integration Points

### Backend API

Expected endpoints (from backend):

```
GET    /api/audios                    # List audios
GET    /api/audios/search?q=query     # Search
POST   /api/audios                    # Upload (FormData)
PUT    /api/audios/{id}               # Update metadata
DELETE /api/audios/{id}               # Delete
```

### Admin Sidebar

Added to navigation in `app/admin/components/AdminShell.tsx`:
```ts
{
  href: '/admin/audio-library',
  label: '🎵 Kho Âm Thanh',
  icon: Music
}
```

## Development Notes

### Styles

Uses Tailwind CSS with existing project patterns:
- No additional packages required
- Responsive design (mobile-friendly)
- Consistent with admin UI

### Error Handling

All components include:
- Try-catch error handling
- User-friendly messages
- Toast notifications (sonner)
- Field validation
- HTTP error handling

### Loading States

Proper UX feedback:
- Skeleton loaders during data fetch
- Button spinners during operations
- Disabled states during processing

### TypeScript

Full type safety:
- Strict mode enabled
- No `any` types
- Proper error typing

## Testing the Implementation

### Prerequisites

1. Backend should have `/api/audios` endpoints
2. Authentication token in localStorage (bhh_admin_token)
3. API endpoint configured in `NEXT_PUBLIC_API_URL`

### Manual Testing Checklist

- [ ] Navigate to `/admin/audio-library`
- [ ] Upload an audio file (drag-drop or click)
- [ ] Search for uploaded audio
- [ ] Click preview button (play audio)
- [ ] Edit audio title/description
- [ ] Delete audio (with confirmation)
- [ ] Test pagination
- [ ] Test sort options
- [ ] Test error cases (invalid file, network error)

## Customization

### Changing Max File Size

Edit in `utils/audioHelpers.ts`:
```ts
export function validateAudioFile(
  file: File,
  maxSizeInMB: number = 50  // Change this value
)
```

Or in component:
```ts
validateAudioFile(file, 100)  // 100MB limit
```

### Changing Items Per Page

Edit in `components/AudioList.tsx`:
```ts
const ITEMS_PER_PAGE = 10  // Change this value
```

### Changing Supported Formats

Edit in `utils/audioHelpers.ts`:
```ts
const allowedMimes = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/x-m4a'
  // Add more MIME types
]

const allowedExtensions = [
  '.mp3',
  '.wav',
  '.m4a',
  '.mp4'
  // Add more extensions
]
```

### Styling Customization

Override in `AudioLibrary.module.css` or use inline Tailwind classes:

```tsx
// Example: Change primary color
className="px-4 py-2 bg-blue-600..."  // Change to bg-purple-600 etc.
```

## Performance Optimization

Already implemented:
- Memoized filtered/paginated lists
- Client-side search (no API calls)
- Single API call on mount
- Proper loading states

Potential future optimizations:
- Server-side pagination
- Infinite scroll
- Virtual scrolling for large lists
- Image preview thumbnails

## Accessibility

Features:
- Semantic HTML (buttons, inputs)
- ARIA labels and descriptions
- Keyboard navigation support
- Color contrast compliance
- Focus management

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires HTML5 audio support

## Troubleshooting

### Audio won't upload

1. Check file size (max 50MB)
2. Check file format (.mp3, .wav, .m4a)
3. Check backend API `/api/audios` endpoint
4. Check network console for errors

### List not loading

1. Check API endpoint availability
2. Verify authentication token
3. Check browser console for errors
4. Ensure backend returns correct format

### Search not working

- Note: Search is client-side only
- Works on title and description
- Case-insensitive

### Edit/Delete not working

1. Check if audio ID is valid
2. Verify PUT/DELETE endpoints
3. Check backend permissions

## Future Enhancements

Potential additions:
- Audio visualization/waveform
- Batch operations
- Advanced metadata editing
- Category/tag system
- Access logging
- Usage statistics
- Sharing/permissions
- Automated transcription

## Contact & Support

For issues or improvements:
1. Check AUDIO_LIBRARY_README.md for detailed docs
2. Review component source code
3. Check browser console for errors
4. Verify backend API implementation

## License

Part of hoccungbe project - Follow project licensing.
