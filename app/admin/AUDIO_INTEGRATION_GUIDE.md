# Audio Library Integration Guide

This document explains how the Audio Library system has been integrated into both Quiz and Exam question forms in the hoccungbe project.

## Overview

The Audio Library system allows administrators to:
1. Upload audio files directly to the library (centralized storage)
2. Select pre-existing audio files from the library for questions, options, and explanations
3. Play back audio files before selection
4. Manage audio metadata (title, description, duration, file size)

## Components

### AudioLibrarySelector.tsx
**Location:** `app/admin/components/AudioLibrarySelector.tsx`

A reusable modal component that provides two tabs:
- **Thư viện (Library)**: Browse and select from existing audio files
  - Real-time search by title or description
  - Shows duration and file size for each audio
  - Audio player controls for preview
  - Loading states and empty state handling
  
- **Tải lên (Upload)**: Upload new audio files directly
  - Uses the existing `AudioUploadForm` component
  - Auto-selects the newly uploaded audio
  - Refreshes library after successful upload

#### Props
```typescript
interface AudioLibrarySelectorProps {
  isOpen: boolean;                          // Control modal visibility
  onClose: () => void;                      // Callback when closing
  onSelect: (audioUrl: string, audioId: string, audioTitle: string) => void;  // Callback on selection
  currentAudioUrl?: string;                 // Show current audio at top
  allowUpload?: boolean;                    // Enable/disable upload tab (default: true)
}
```

#### Usage Example
```tsx
const [selectorOpen, setSelectorOpen] = useState(false);

<AudioLibrarySelector
  isOpen={selectorOpen}
  onClose={() => setSelectorOpen(false)}
  onSelect={(audioUrl) => setQuestionAudio(audioUrl)}
  currentAudioUrl={form.questionAudioUrl}
  allowUpload={true}
/>
```

## Integration in QuizForm

**Location:** `app/admin/quizzes/components/QuizForm.tsx`

### Added Audio Support for:
1. **Question Audio** (Audio đọc câu hỏi)
   - Button: "Chọn audio" or "Đổi audio" if already set
   - Displays current audio in player
   - Can clear audio with X button

2. **Option Audio** (Audio đáp án)
   - Each option can have its own audio
   - Small button to add/change audio for each option
   - Player shows current audio if exists

3. **Explanation Audio** (Audio giải thích đáp án)
   - Audio for the explanation text
   - Same UI pattern as question audio

### Implementation Details
- State management handles three types of audio selections: question, explanation, and option (with index)
- Audio URLs are stored in the form data and sent with the API request
- Backward compatible: existing questions without audio still work
- File paths from the audio library API are used directly

### Form Data Structure
```typescript
export type QuizFormData = {
  // ... other fields ...
  questionAudioUrl: string;      // New field
  explanationAudioUrl: string;   // New field
  options: { 
    // ... other fields ...
    audioUrl?: string;           // New field
  }[];
  // ... other fields ...
};
```

## Integration in ExamQuestionForm

**Location:** `app/admin/exams/QuestionForm.tsx`

### Added Audio Support for:
1. **Question Audio** (Audio đọc câu hỏi)
   - Same as in QuizForm
   - Positioned after question image URL field

2. **Option Audio** (Audio đáp án)
   - Only for choice-based questions (single_choice, multiple_choice)
   - Enhanced UI with separate audio section per option
   - Player and add/change controls

3. **Explanation Audio** (Audio giải thích)
   - Added after explanation textarea
   - Optional field

### ExamQuestion Interface Updates
```typescript
export interface ExamQuestion {
  // ... existing fields ...
  questionAudioUrl?: string;        // New optional field
  explanationAudioUrl?: string;     // New optional field
  optionsJson?: { 
    // ... existing fields ...
    audioUrl?: string;              // New optional field
  }[];
  // ... existing fields ...
}
```

## API Integration

The component uses the existing audio library hook:

### useAudioLibrary Hook
**Location:** `app/admin/audio-library/hooks/useAudioLibrary.ts`

Available functions:
- `fetchAudios(options)`: Get list of all audios
- `searchAudios(query, limit)`: Search audios by title/description
- `uploadAudio(data)`: Upload new audio file
- `updateAudio(id, data)`: Update audio metadata
- `deleteAudio(id)`: Delete audio file

### Audio Data Structure
```typescript
export interface Audio {
  id: string;
  title: string;
  description?: string;
  file_path: string;              // Full URL to audio file
  duration: number;               // In seconds
  file_size: number;              // In bytes
  mime_type: string;              // e.g., "audio/mpeg"
  status: 'active' | 'deleted';
  created_at: string;
  updated_at: string;
}
```

## File URL Handling

Audio file URLs returned from the API are used directly as `src` attributes in `<audio>` elements. The `file_path` field contains the complete URL ready to use.

## Styling and UX

### Audio Buttons
- Blue text on white background with border
- Hover state: light blue background
- Icon: Volume2 from lucide-react
- Responsive sizing (adapts to button placement)

### Audio Players
- Uses native HTML5 `<audio>` element
- Shows controls: play/pause, timeline, volume
- Height: `h-8` for main sections, `h-6` for inline options

### Modal Dialog
- Centered on screen with semi-transparent backdrop
- Max-width: 42rem (2xl)
- Tabs for easy switching between library and upload
- Escape key closes the modal
- Current audio preview at top

## Error Handling

- Network errors during fetch/search show empty state
- Upload errors are handled by AudioUploadForm component
- Invalid audio URLs gracefully fail to load in player
- Validation messages from upload form are preserved

## Best Practices

1. **File Naming**: Use descriptive titles for audio files in the library
   - Example: "Lesson 1 Question Read" instead of "audio_1.mp3"

2. **File Sizes**: Keep audio files under 50MB (enforced by AudioUploadForm)
   - Recommended: MP3 format for best compatibility

3. **Audio Duration**: Include audio for all question types if using them
   - Question audio: reads the question
   - Option audio: reads each option (recommended for language learning)
   - Explanation audio: reads the explanation

4. **Backward Compatibility**: Existing questions/exams without audio continue to work
   - Audio fields are optional
   - No migration needed for old data

## Testing the Integration

### QuizForm Test Steps:
1. Navigate to Quiz editor (new or existing)
2. Click "Chọn audio" button next to question text
3. Try both Library and Upload tabs
4. Search for audio files
5. Select an audio - it should appear in the player
6. Click "Đổi audio" to change it
7. Add options and assign audio to each
8. Save the quiz

### ExamQuestionForm Test Steps:
1. Navigate to Exam question editor (new or existing)
2. Select a question type with options (single_choice, multiple_choice)
3. Try adding audio for the question
4. Add options and assign audio to each
5. Add explanation audio
6. Save the question

## Troubleshooting

### Audio not playing
- Verify the audio file exists in the library
- Check browser console for CORS errors
- Ensure audio format is supported (MP3, WAV, M4A)

### Modal not opening
- Ensure AudioLibrarySelector is properly imported
- Check that `isOpen` prop is being controlled correctly
- Verify state management for audio selector type

### Audio not saving
- Verify API endpoints are correct
- Check that audio URL is being passed to form submission
- Look at network tab in browser dev tools for request details

## Future Enhancements

Possible future improvements:
1. Audio trimming/editing before upload
2. Batch audio operations (bulk upload, bulk assign)
3. Audio tagging/categorization in library
4. Audio variants (different languages/speeds)
5. Audio usage analytics (which audios are used most)
6. Transcription/subtitle generation from audio
