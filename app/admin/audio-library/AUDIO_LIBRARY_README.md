# Audio Library Admin UI

Complete frontend implementation for managing audio files in the hoccungbe system.

## Project Structure

```
app/admin/audio-library/
├── components/
│   ├── AudioUploadForm.tsx     # File upload component with validation
│   ├── AudioList.tsx           # Audio list with search, sort, pagination
│   ├── AudioPreviewModal.tsx   # Audio player and metadata viewer
│   └── AudioEditModal.tsx      # Edit metadata and delete audio
├── hooks/
│   └── useAudioLibrary.ts      # Custom hook for API interactions
├── utils/
│   └── audioHelpers.ts         # Helper functions for validation & formatting
├── types/
│   └── types.ts                # TypeScript interfaces and types
├── layout.tsx                  # Layout wrapper
└── page.tsx                    # Main page with tabs
```

## Features

### 1. Audio Upload (Tải Lên Tab)
- Drag-and-drop file upload
- File type validation (.mp3, .wav, .m4a, max 50MB)
- Title and description fields
- Client-side validation
- Success/error notifications
- Form reset after successful upload

### 2. Audio List (Danh Sách Tab)
- Display all uploaded audios in a table
- Real-time search by title or description
- Sort by title (A-Z) or creation date (newest first)
- Pagination (10 items per page)
- Status badges (Active/Deleted)
- Display: Title, Duration, File Size, Status, Created Date
- Action buttons: Preview, Edit, Delete

### 3. Audio Preview Modal
- HTML5 audio player
- Display metadata:
  - Title
  - Description
  - Duration (MM:SS format)
  - File size (human-readable)
  - MIME type
  - Status
  - Upload date
- Download button
- Close button

### 4. Audio Edit Modal
- Edit title and description
- Read-only file information display
- Delete confirmation with checkbox
- Save with loading state
- Error handling

### 5. Helper Functions (utils/audioHelpers.ts)

#### formatFileSize(bytes)
Converts bytes to human-readable format (B, KB, MB, GB)
```ts
formatFileSize(1048576) // "1.0 MB"
```

#### formatDuration(seconds)
Converts duration to MM:SS format
```ts
formatDuration(125) // "2:05"
```

#### validateAudioFile(file, maxSizeInMB)
Validates file type and size
```ts
const { valid, error } = validateAudioFile(file, 50)
```

#### validateTitle(title)
Validates title length (3-255 characters)
```ts
const { valid, error } = validateTitle(title)
```

#### getFileExtension(filename)
Extracts file extension
```ts
getFileExtension("song.mp3") // ".mp3"
```

### 6. Custom Hook (hooks/useAudioLibrary.ts)

#### useAudioLibrary()
Provides all API interactions with loading and error states:

```ts
const {
  fetchAudios,      // Fetch all audios with pagination/sorting
  uploadAudio,      // Upload new audio file
  updateAudio,      // Update title/description
  deleteAudio,      // Delete audio
  searchAudios,     // Search audios
  isLoading,        // Global loading state
  isUploading,      // Upload specific state
  isDeleting,       // Delete specific state
  error,            // Error message
} = useAudioLibrary()
```

### 7. TypeScript Types (types/types.ts)

```ts
interface Audio {
  id: string
  title: string
  description?: string
  file_path: string
  duration: number           // in seconds
  file_size: number          // in bytes
  mime_type: string          // e.g., "audio/mpeg"
  status: 'active' | 'deleted'
  created_at: string         // ISO date
  updated_at: string         // ISO date
}

interface UploadFormData {
  title: string
  description?: string
  file: File
}

interface AudioListFilters {
  search: string
  sortBy: 'title' | 'created_date'
  page: number
}

interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}
```

## API Integration

### Endpoints Used

- `GET /api/audios` - Fetch audios (with pagination, sorting)
- `GET /api/audios/search?q=query` - Search audios
- `POST /api/audios` - Upload audio (FormData)
- `PUT /api/audios/{id}` - Update audio metadata
- `DELETE /api/audios/{id}` - Delete audio

### Request Examples

**Upload audio:**
```ts
const formData = new FormData()
formData.append('title', 'My Audio')
formData.append('description', 'A nice audio file')
formData.append('file', audioFile)

const res = await apiFetch('/audios', {
  method: 'POST',
  body: formData
})
```

**Update audio:**
```ts
const res = await apiFetch(`/audios/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
    title: 'New Title',
    description: 'New description'
  })
})
```

## Styling

Uses Tailwind CSS following the project's existing pattern:

- **Colors**: Blue (#2563eb) for primary, Green for active, Red for delete
- **Components**: Reusable Badge component from admin/components
- **Responsive**: Mobile-friendly with proper spacing
- **Accessibility**: ARIA labels, keyboard support, semantic HTML

## Usage

### Page Integration

The audio library is accessible at `/admin/audio-library` and appears in the admin sidebar navigation with a music icon.

### Tab Navigation

Page uses tabbed interface:
- "Danh Sách" (List) - Browse and manage existing audios
- "Tải Lên" (Upload) - Upload new audio files

### Refresh Behavior

After successful upload, the page automatically:
1. Switches to the List tab
2. Refreshes the audio list
3. Shows success notification

## Error Handling

All components include:
- Try-catch error handling
- User-friendly error messages
- Toast notifications (using sonner)
- Field-level validation with error display
- HTTP error handling (401 auto-logout via apiFetch)

## Loading States

Components show appropriate loading states:
- Upload form: Submit button with spinner
- List: Skeleton loaders while fetching
- Modals: Disabled buttons with spinners during operations
- Delete: Confirmation checkbox requirement

## Performance

- Search is client-side (local filtering)
- Pagination limits table to 10 items
- Memoized filtered/paginated results
- Debounced search on page reset

## Browser Support

- Modern browsers with HTML5 audio support
- File API for uploads
- ES6+ JavaScript features

## Future Enhancements

Potential additions:
- Audio preview waveform visualization
- Batch upload
- Audio conversion
- Duration auto-calculation
- Metadata extraction
- S3/cloud storage integration
- Access logging
- Sharing features

## Notes

- Frontend only - no authentication implemented yet
- Uses existing `apiFetch` utility from admin/lib/api.ts
- Follows project conventions (hooks, component patterns)
- Full TypeScript with strict mode
- Production-ready code
