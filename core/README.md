# CB2FA Core Components

This directory contains **shared components** used across all CB2FA implementations.

## 🌍 Internationalization (i18n)

**Location**: `./i18n/`

Shared translations for all CB2FA implementations supporting 7 languages:
- 🇬🇧 English (default)
- 🇷🇺 Russian  
- 🇩🇪 German
- 🇨🇳 Chinese (Simplified)
- 🇫🇷 French
- 🇪🇸 Spanish
- 🇹🇷 Turkish

### Usage
```typescript
import { t, availableLanguages } from '@cb2fa/core/i18n';

// Get translated message
const message = t('loginRequest');  // "🔐 Login Request"

// List available languages
console.log(availableLanguages);
```

## 🔄 Queue System  

**Location**: `./queue/`

Shared queue management for handling multiple simultaneous requests:
- One active request at a time
- Automatic queuing and processing
- Timeout handling
- Anti-spam protection

### Usage
```typescript
import { RequestQueue } from '@cb2fa/core/queue';

const queue = new RequestQueue({
  timeout: 15 * 60 * 1000, // 15 minutes
});

await queue.add(request);
```

## 🏗️ Types

**Location**: `./types/`

Shared TypeScript types and interfaces:
```typescript
interface LoginRequest {
  username: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

interface ApprovalResponse {
  approved: boolean;
  timestamp: Date;
  approver?: string;
}
```

## 🔧 Utils

**Location**: `./utils/`

Shared utility functions:
- Input validation
- Security helpers  
- Common formatting
- Configuration loading

---

**Note**: Core components are designed to be platform-agnostic and reusable across all CB2FA implementations.
