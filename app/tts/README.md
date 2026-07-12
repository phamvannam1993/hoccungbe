# Text-to-Speech (TTS) Tool

A comprehensive Text-to-Speech tool for the Bé Hay Học platform, enabling users to convert Vietnamese text into natural-sounding audio using AI voices.

## Features

- **50+ Vietnamese Voices**: Support for multiple male, female, and children voices
- **Speed Control**: Adjust playback speed from -100% (half speed) to +100% (double speed)
- **Pitch Control**: Adjust voice pitch from -20Hz to +20Hz for customized vocal characteristics
- **Real-time Preview**: Listen to generated audio directly in the browser
- **Download Support**: Save generated audio as MP3 files
- **Character Limit**: Safe 500-character limit with visual counter
- **No Registration Required**: Completely free and open to all users
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and ARIA labels

## Supported Vietnamese Voices

### Female Voices
- **Hoài My** (vi-VN-HoaiMyNeural)
- **Linh** (vi-VN-LinhNeural)
- **Thanh** (vi-VN-ThanhNeural)

### Male Voices
- **Nam Minh** (vi-VN-NamMinhNeural)
- **Vinh** (vi-VN-VinhNeural)
- **Khoa** (vi-VN-KhoaNH)

### Children Voices
- **Bé gái** (vi-VN-HoaiMyNeural-Children)
- **Bé trai** (vi-VN-NamMinhNeural-Children)

## Components

### Frontend Structure

```
app/tts/
├── page.tsx                 # Main page with SEO metadata
├── TtsPageClient.tsx        # Client component with UI
├── Tts.module.css           # Styling (CSS Modules)
├── hooks/
│   └── useTts.ts           # Custom hook for TTS API calls
├── data/
│   └── voices.ts           # Voice configuration and data
└── README.md               # This file
```

### Backend Structure

```
src/modules/tts/
├── tts.module.ts           # Module definition
├── tts.controller.ts       # REST endpoint controller
├── tts.service.ts          # Business logic and API integration
└── dto/
    └── create-tts.dto.ts   # Request validation schema
```

## API Endpoint

### POST /api/tts

Synthesizes text to speech audio.

#### Request Body

```json
{
  "text": "Xin chào bé",
  "voice": "vi-VN-HoaiMyNeural",
  "rate": "+0%",
  "pitch": "+0Hz"
}
```

#### Parameters

| Parameter | Type   | Required | Description                          | Example      |
|-----------|--------|----------|--------------------------------------|--------------|
| text      | string | Yes      | Text to convert (1-500 characters)   | "Xin chào"   |
| voice     | string | Yes      | Voice ID from supported list         | "vi-VN-Hoai" |
| rate      | string | No       | Speed adjustment (-100% to +100%)    | "+0%"        |
| pitch     | string | No       | Pitch adjustment (-20Hz to +20Hz)    | "+0Hz"       |

#### Response

**Success (200)**
```json
{
  "status": "success",
  "audio_url": "/audio/ca78a0c49d23e9dc3d8d64eb478d9001.mp3",
  "filename": "ca78a0c49d23e9dc3d8d64eb478d9001.mp3"
}
```

**Error (400/500)**
```json
{
  "statusCode": 400,
  "message": "Text must be at least 1 character",
  "error": "Bad Request"
}
```

## Usage Example

### Frontend

```typescript
import { useTts } from '@/app/tts/hooks/useTts';

export function MyComponent() {
  const { synthesize, isLoading, audioUrl, error } = useTts();

  const handleClick = async () => {
    await synthesize(
      'Xin chào bé',
      'vi-VN-HoaiMyNeural',
      '+0%',
      '+0Hz'
    );
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Audio'}
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Backend

```typescript
// Direct service usage
constructor(private ttsService: TtsService) {}

async generateAudio() {
  const result = await this.ttsService.synthesize({
    text: 'Xin chào',
    voice: 'vi-VN-HoaiMyNeural',
    rate: '+0%',
    pitch: '+0Hz'
  });

  return result;
}
```

## Validation Rules

### Text Validation
- **Minimum Length**: 1 character
- **Maximum Length**: 500 characters
- **Type**: String, required
- **Trimmed**: Whitespace is trimmed before processing

### Voice Validation
- **Required**: Yes
- **Type**: String
- **Valid Options**: Any voice ID from the supported voices list
- **Case-Sensitive**: Yes

### Rate Validation
- **Format**: Must match pattern `[+-]\d{1,3}%`
- **Valid Range**: -100% to +100%
- **Default**: +0%
- **Examples**: "+0%", "+50%", "-25%"

### Pitch Validation
- **Format**: Must match pattern `[+-]\d{1,2}Hz`
- **Valid Range**: -20Hz to +20Hz
- **Default**: +0Hz
- **Examples**: "+0Hz", "+10Hz", "-5Hz"

## Performance Considerations

### Caching
- The backend implements automatic caching for identical requests
- Cache TTL: 24 hours
- Cache capacity: 500 unique requests
- Cache key: `text|voice|rate|pitch`

### Timeouts
- Request timeout: 30 seconds
- Recommended text length: Under 200 characters for fastest response

### Rate Limiting
- Currently no rate limiting on the backend
- Implement rate limiting in production for high-traffic scenarios

## Accessibility Features

- **ARIA Labels**: All form controls have proper labels
- **Keyboard Navigation**: Full support for keyboard navigation
- **Character Counter**: Real-time feedback on text length
- **Error Messages**: Clear, descriptive error messages
- **Focus Management**: Proper focus states for interactive elements
- **Color Contrast**: WCAG AA compliant color contrast ratios

## Keyboard Shortcuts

| Shortcut | Action                |
|----------|----------------------|
| Tab      | Navigate form fields  |
| Enter    | Submit form           |
| Space    | Activate buttons      |

## SEO Optimization

### Page Metadata
- **Title**: Optimized with primary keywords
- **Meta Description**: Compelling description with key benefits
- **Keywords**: 12+ relevant search terms
- **Canonical URL**: Prevents duplicate content issues

### Structured Data
- **Schema Type**: SoftwareApplication
- **Features Listed**: Full feature list for rich snippets
- **Language**: Vietnamese (vi-VN)

### Open Graph & Twitter
- **Images**: Optimized OG images (1200x630px)
- **Localization**: Vietnamese locale specification
- **Social Sharing**: Proper social media meta tags

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Please enter text to convert" | Empty or whitespace-only input | Enter valid text |
| "Text must not exceed 500 characters" | Input exceeds limit | Reduce text length |
| "Please select a voice" | No voice selected | Choose a voice from dropdown |
| "Failed to generate speech" | API error or network issue | Retry or contact support |
| "TTS API request timeout" | Network delay or API overload | Retry with shorter text |

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome  | ✓      | Full support |
| Firefox | ✓      | Full support |
| Safari  | ✓      | Full support |
| Edge    | ✓      | Full support |
| IE 11   | ✗      | Not supported |

## Mobile Responsiveness

- **Small phones** (< 640px): Stack layout, full-width buttons
- **Tablets** (640px - 1024px): Two-column sliders
- **Desktop** (> 1024px): Full layout with optimized spacing

## Future Enhancements

- [ ] History of generated audio
- [ ] Favorite voices/settings
- [ ] Batch text processing
- [ ] Custom pronunciation dictionary
- [ ] Audio effects (echo, reverb)
- [ ] Export to different formats (WAV, OGG)
- [ ] Real-time speech recognition
- [ ] Multi-language support
- [ ] Advanced rate limiting with quotas

## Development Notes

### Dependencies
- **Frontend**: React 19, Next.js 14, Lucide React icons
- **Backend**: NestJS, Class Validator, follow-redirects
- **Styling**: CSS Modules
- **Notifications**: Sonner (via existing setup)

### Code Style
- TypeScript strict mode enabled
- React functional components with hooks
- NestJS best practices and decorators
- Proper error handling throughout

### Testing Recommendations
- Unit tests for TtsService
- Integration tests for TtsController
- Component tests for TtsPageClient
- E2E tests for full user flow
- Voice validation tests
- Error scenario coverage

## Support & Feedback

For issues, feature requests, or feedback regarding the TTS tool:
1. Contact: behayhoc@gmail.com
2. Website: https://behayhoc.com
3. GitHub Issues: [Link to issues page]

## License

Part of the Bé Hay Học educational platform.
