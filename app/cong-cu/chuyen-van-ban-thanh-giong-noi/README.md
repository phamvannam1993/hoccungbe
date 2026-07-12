# TTS Tool - Chuyển Văn Bản Thành Giọng Nói

Advanced Text-to-Speech tool with rate limiting, input validation, and admin management.

## URL Structure

- **Production URL**: `/cong-cu/chuyen-van-ban-thanh-giong-noi`
- **Legacy redirect**: `/tts` (redirects to new URL)

SEO-friendly Vietnamese URL structure optimized for search engines.

## Features

### User-Facing Features

1. **Text Input Validation**
   - Maximum 500 characters per request
   - Real-time character counter with warnings
   - Character type validation (Vietnamese, English, basic punctuation)
   - Profanity and inappropriate content detection
   - Clear validation error messages

2. **Voice Selection**
   - 50+ Vietnamese voices (male, female, children)
   - Simple dropdown selector

3. **Audio Controls**
   - Speed adjustment (-100% to +100%)
   - Pitch adjustment (-20Hz to +20Hz)
   - Real-time parameter preview

4. **Output**
   - Audio player with playback controls
   - MP3 download functionality
   - Share link copy functionality

5. **Rate Limiting**
   - Per-IP rate limiting (100 requests per hour by default)
   - Remaining quota display
   - Clear rate limit exceeded messages
   - Automatic daily reset

### Admin Features

**Access**: `/admin/rate-limits`

1. **Configuration**
   - Edit daily/hourly request limits
   - Configure time window (minute, hour, day)
   - Real-time configuration updates

2. **Monitoring**
   - View usage statistics (last 24 hours)
   - Block rate analytics
   - Top IPs by request count
   - Total logs stored

3. **IP Management**
   - Whitelist IPs (unlimited access)
   - Blacklist IPs (deny completely)
   - Add reasons and admin notes
   - Quick add/remove interface

4. **Maintenance**
   - Clear all logs
   - Reset specific IP rate limits
   - Reset all rate limits

## Technical Architecture

### Frontend Components

```
app/cong-cu/chuyen-van-ban-thanh-giong-noi/
├── page.tsx                 # Server component with metadata
├── TtsPageClient.tsx         # Client component (main UI)
├── Tts.module.css           # Component styles
├── hooks/
│   └── useTts.ts           # TTS API hook with rate limit awareness
├── lib/
│   └── validators.ts       # Input validation utilities
└── data/
    └── voices.ts           # Vietnamese voices data
```

### Backend Services

```
lib/rate-limiting/
├── rateLimit.ts            # Core rate limiter (token bucket algorithm)
├── getClientIp.ts          # IP extraction (proxy-aware)
└── storage.ts              # In-memory rate limit storage

app/api/tts/
└── route.ts               # Enhanced TTS API with rate limiting

app/api/admin/rate-limits/
├── stats/route.ts         # Statistics API
├── config/route.ts        # Configuration API
├── whitelist/route.ts     # Whitelist management
├── blacklist/route.ts     # Blacklist management
├── logs/route.ts          # Logs retrieval and clearing
└── reset/route.ts         # Rate limit reset

app/admin/rate-limits/
├── page.tsx               # Admin dashboard
└── RateLimitAdmin.module.css
```

## API Endpoints

### TTS Synthesis

**POST /api/tts**

Request:
```json
{
  "text": "Xin chào",
  "voice": "vi-VN-HoaiMyNeural",
  "rate": "+0%",
  "pitch": "+0Hz"
}
```

Response:
```json
{
  "status": "success",
  "audio_url": "data:audio/mpeg;base64,...",
  "filename": "audio_1234567890.mp3"
}
```

Headers:
- `X-RateLimit-Remaining: 99` - Remaining requests
- `X-RateLimit-Reset: 1234567890` - Unix timestamp when limit resets

### Admin API

All admin endpoints require authentication (implement as needed):

**GET /api/admin/rate-limits/stats**
- Returns statistics and top IPs

**GET /api/admin/rate-limits/config**
- Returns current configuration

**POST /api/admin/rate-limits/config**
- Update rate limit settings

**GET/POST/DELETE /api/admin/rate-limits/whitelist**
- Manage whitelisted IPs

**GET/POST/DELETE /api/admin/rate-limits/blacklist**
- Manage blacklisted IPs

**GET /api/admin/rate-limits/logs**
- Retrieve rate limit logs

**POST /api/admin/rate-limits/reset**
- Reset rate limits for IP or all

## Rate Limiting

### Algorithm: Token Bucket

Each IP has a bucket that:
- Starts with `maxRequests` tokens
- Refills over `windowMs` time period
- Each request costs 1 token
- Requests blocked when bucket empty

### Default Configuration

- **Max Requests**: 100 per hour
- **Window**: 3600000ms (1 hour)
- **Refill Rate**: Linear over time window

### Client Response

When rate limited (HTTP 429):
```
Retry-After: 3600
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890
```

Error message shown to user:
> "Bạn đã vượt quá giới hạn sử dụng. Vui lòng thử lại vào ngày mai."

## Input Validation

### Character Restrictions

**Allowed**:
- Vietnamese letters (with diacritics: à, á, ả, ã, ạ, etc.)
- English letters (a-z, A-Z)
- Numbers (0-9)
- Whitespace and basic punctuation: `.`, `,`, `!`, `?`, `;`, `:`, `-`, `—`, `(`, `)`, `[`, `]`, `'`, `"`, `/`, `\`

**Blocked**:
- Emojis
- Special symbols (@, #, $, %, &, *, etc.)
- HTML/XML tags
- Control characters

### Length Validation

- **Minimum**: 1 character
- **Maximum**: 500 characters
- **Warning threshold**: 400 characters (shows "Sắp hết chỗ")
- **Error threshold**: >500 (prevents submission)

### Profanity Filter

Basic profanity patterns included. Can be extended in `validators.ts`:
```typescript
const PROFANITY_PATTERNS = [
  /\b(inappropriate|words)\b/gi,
];
```

## Configuration & Customization

### Change Rate Limit Defaults

Edit `/lib/rate-limiting/rateLimit.ts`:
```typescript
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,        // Change here
  windowMs: 3600000,       // or here
};
```

### Customize Validation Rules

Edit `/app/cong-cu/chuyen-van-ban-thanh-giong-noi/lib/validators.ts`:
```typescript
export const MAX_CHARACTERS = 500;
export const WARNING_THRESHOLD = 400;
export const MIN_CHARACTERS = 1;
```

### Add More Profanity Patterns

Edit `/app/cong-cu/chuyen-van-ban-thanh-giong-noi/lib/validators.ts`:
```typescript
const PROFANITY_PATTERNS = [
  /pattern/gi,  // Add here
];
```

### Change Voices

Edit `/app/cong-cu/chuyen-van-ban-thanh-giong-noi/data/voices.ts`:
```typescript
export const vietnameseVoices: Voice[] = [
  // Add voices here
];
```

## Environment Variables

Currently uses default configuration. For production, consider:

```env
TTS_RATE_LIMIT_MAX=100
TTS_RATE_LIMIT_WINDOW=3600000
TTS_API_TIMEOUT=30000
```

## Deployment Notes

### Cache Behavior

- Audio files cached in memory (up to 300 entries)
- Cache persists across requests on same Node.js process
- Cache cleared on server restart

### Rate Limit Storage

- **Development**: In-memory (resets on server restart)
- **Production**: Consider upgrading to:
  - Redis for distributed rate limiting
  - Database for persistence
  - Kafka for analytics

### Performance

- Typical response time: 200-500ms (including Google Translate API)
- Cached responses: 10-50ms
- No database queries required for TTS API
- Admin dashboard uses REST API

## Security Considerations

1. **IP Extraction**: Handles proxy headers correctly
   - `X-Forwarded-For`
   - `cf-connecting-ip` (Cloudflare)
   - `x-real-ip` (Nginx)

2. **Input Validation**: Server-side checks all user input

3. **Authentication**: Admin endpoints should implement authentication
   - Currently has comments for session checks
   - Integrate with existing auth system

4. **Logging**: All rate limit violations logged for monitoring

## Monitoring & Debugging

### Check Rate Limit Status

Browser DevTools → Network tab → Response Headers:
```
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
X-Cache: HIT (if cached)
```

### Admin Dashboard

Visit `/admin/rate-limits` to see:
- Real-time statistics
- Top IPs by usage
- Whitelist/blacklist entries
- Log count

### Server Logs

Rate limit violations are logged to console:
```
TTS API Error: [reason]
```

## Testing

### Manual Testing

1. **Normal flow**:
   - Visit `/cong-cu/chuyen-van-ban-thanh-giong-noi`
   - Enter text and synthesize
   - Check rate limit headers in DevTools

2. **Validation testing**:
   - Enter special characters (should be rejected)
   - Enter 500+ characters (should be rejected)
   - Try profanity (should be rejected)

3. **Rate limiting**:
   - Make 100 requests quickly
   - 101st request should return 429
   - Headers should show 0 remaining

4. **Admin testing**:
   - Visit `/admin/rate-limits`
   - Add IP to whitelist
   - Verify whitelist persists
   - Check statistics update

### API Testing with curl

```bash
# Test TTS endpoint
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Xin chào","voice":"vi-VN-HoaiMyNeural"}'

# Check stats
curl http://localhost:3000/api/admin/rate-limits/stats

# Add to whitelist
curl -X POST http://localhost:3000/api/admin/rate-limits/whitelist \
  -H "Content-Type: application/json" \
  -d '{"ipAddress":"127.0.0.1","reason":"testing"}'
```

## Future Enhancements

1. **Database Integration**
   - Persist rate limit data
   - Track historical analytics
   - User-specific limits

2. **Redis Support**
   - Distributed rate limiting
   - Faster lookups
   - Cloud deployment support

3. **Advanced Features**
   - Batch processing
   - Queue management
   - Webhook notifications

4. **Monitoring**
   - Grafana dashboard
   - Alert system
   - Email notifications

5. **User Features**
   - Save favorite voices
   - History tracking
   - Batch requests

## Troubleshooting

### Rate Limit Issues

**Problem**: Getting 429 immediately
- **Solution**: Check if IP is blacklisted
- **Fix**: Remove from blacklist in admin panel

**Problem**: Rate limit not working
- **Solution**: Check if IP is whitelisted
- **Fix**: Verify whitelist doesn't have unwanted IPs

### Validation Issues

**Problem**: Valid text being rejected
- **Solution**: Check character validation rules
- **Fix**: Adjust VIETNAMESE_PATTERN in validators.ts

### Cache Issues

**Problem**: Stale audio being returned
- **Solution**: Cache is intentional for performance
- **Fix**: Clear cache by restarting server

## Support

For issues or questions:
1. Check admin dashboard at `/admin/rate-limits`
2. Review browser console for errors
3. Check server logs
4. Review input validation rules
5. Verify whitelist/blacklist settings

## License

Part of Bé Hay Học educational platform.
