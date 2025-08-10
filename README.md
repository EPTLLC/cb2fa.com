# CB2FA - Community-Based Two-Factor Authentication v2.0.0

```
 ██████╗██████╗ ██████╗ ███████╗ █████╗ 
██╔════╝██╔══██╗╚════██╗██╔════╝██╔══██╗
██║     ██████╔╝ █████╔╝█████╗  ███████║
██║     ██╔══██╗██╔═══╝ ██╔══╝  ██╔══██║
╚██████╗██████╔╝███████╗██║     ██║  ██║
 ╚═════╝╚═════╝ ╚══════╝╚═╝     ╚═╝  ╚═╝
```

**Matrix-Focused Release**  
**Company: EasyProTech LLC (www.easypro.tech)**  
**Dev: Brabus**  
**Modified: 2025-08-10 21:40 MSK**  
**Telegram: https://t.me/easyprotech**

---

## Overview

CB2FA (Community-Based Two-Factor Authentication) is a revolutionary trust-based authentication platform for Matrix homeservers that replaces traditional device-based 2FA with human community approval.

**Core Principle:** Trust people, not devices.

### The Problem

Traditional 2FA systems rely on:
- **Devices you can lose** (phones, hardware tokens)
- **Secrets you can forget** (backup codes, passwords)  
- **Apps that can break** (authenticator failures, sync issues)

### The CB2FA Solution

Community-Based 2FA relies on:
- **People you trust** (community members with approval rights)
- **Simple y/n decisions** (no complex UI or setup required)
- **Platforms you already use** (Matrix rooms for communication)

When someone attempts to log in, trusted community members receive real-time notifications and can approve or deny access with simple 'y' or 'n' commands.

## Architecture

```
User Login → nginx → CB2FA Middleware → Queue → Bot → Matrix Room → Community Decision
```

### Core Components

**Middleware Layer**
- Intercepts Matrix login requests via nginx proxy
- Validates credentials with Synapse before community approval
- Manages request queue to prevent overwhelming community

**Matrix Bot Integration** 
- Creates formatted approval requests in designated Matrix room
- Processes community y/n responses in real-time
- Maintains audit trail of all decisions

**Queue Management System**
- One active request at a time for clear community focus
- Automatic queuing of simultaneous login attempts
- Natural rate limiting and anti-DDoS protection

## Features

### Authentication Flow
- **Credential Validation** - Synapse verification before community approval
- **Real-time Notifications** - Instant Matrix room alerts for login attempts
- **Simple Decision Interface** - Binary y/n responses from trusted users
- **Audit Trail** - Complete logging of all authentication decisions

### Security Model
- **Pre-validation** - Invalid credentials rejected before CB2FA engagement
- **Community Oversight** - Multiple trusted users can see and respond to requests
- **Timeout Protection** - Automatic denial of expired requests
- **Queue Management** - Prevention of request flooding

### Internationalization
- **Multi-language Support** - 7 languages out of the box
- **Supported Languages:** English, Russian, German, Chinese (Simplified), French, Spanish, Turkish
- **Dynamic Language Selection** - Environment variable configuration

### Technical Specifications
- **Runtime:** Deno + TypeScript for modern JavaScript execution
- **Dependencies:** Minimal external dependencies for security and reliability
- **Database:** SQLite for lightweight request logging
- **Deployment:** nginx reverse proxy with systemd service integration

## Quick Start

### Prerequisites
- Matrix homeserver (Synapse recommended)
- nginx web server for request proxying
- Deno runtime environment

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/EPTLLC/cb2fa.com.git
   cd cb2fa.com
   ```

2. **Install Deno**
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Matrix settings
   ```

4. **Start Services**
   ```bash
   # Start the bot
   deno task start
   
   # Start the middleware (separate terminal)
   deno task middleware
   ```

5. **Configure nginx Proxy**
   ```nginx
   location ~ ^/_matrix/client/(r0|v3)/login$ {
       proxy_pass http://127.0.0.1:9999;
       proxy_set_header X-Forwarded-For $remote_addr;
       proxy_set_header Host $host;
   }
   ```

## Configuration

### Environment Variables (.env)

```bash
# Matrix Configuration
MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_BOT_USERNAME=cb2fa_bot
MATRIX_BOT_PASSWORD=your_bot_password
MATRIX_DOMAIN=your-matrix-domain.com

# CB2FA Settings  
MATRIX_ADMIN_FOR_AUTH=admin
CB2FA_INVITED_USERS=admin,alice,bob
CB2FA_ROOM_NAME=CB2FA Authorization
CB2FA_TIMEOUT_MINUTES=15

# Service Ports
CB2FA_BOT_PORT=10000
CB2FA_MIDDLEWARE_PORT=9999

# Localization
LANGUAGE=en  # en/ru/de/zh-cn/fr/es/tr
```

### Language Configuration

Set the `LANGUAGE` environment variable to one of:
- `en` - English (default)
- `ru` - Russian (Русский)
- `de` - German (Deutsch)
- `zh-cn` - Chinese Simplified (中文简体)
- `fr` - French (Français)
- `es` - Spanish (Español)
- `tr` - Turkish (Türkçe)

## Production Deployment

### systemd Service Configuration

**CB2FA Bot Service** (`/etc/systemd/system/cb2fa-bot.service`):
```ini
[Unit]
Description=CB2FA Matrix Bot
After=network.target

[Service]
Type=simple
User=cb2fa
WorkingDirectory=/opt/cb2fa
ExecStart=/usr/local/bin/deno run --allow-net --allow-env --allow-read src/main.ts
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**CB2FA Middleware Service** (`/etc/systemd/system/cb2fa-middleware.service`):
```ini
[Unit]
Description=CB2FA Authentication Middleware
After=network.target

[Service]
Type=simple
User=cb2fa
WorkingDirectory=/opt/cb2fa
ExecStart=/usr/local/bin/deno run --allow-net --allow-env --allow-read middleware.ts
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Service Management
```bash
sudo systemctl enable cb2fa-bot cb2fa-middleware
sudo systemctl start cb2fa-bot cb2fa-middleware
sudo systemctl status cb2fa-bot cb2fa-middleware
```

### Health Monitoring
```bash
# Check service health
curl http://localhost:10000/health    # Bot health
curl http://localhost:9999/health     # Middleware health
```

## Development

### Development Mode
```bash
# Auto-reload development
deno task dev
```

### Available Tasks
```bash
deno task start      # Start production bot
deno task middleware # Start production middleware  
deno task dev        # Development mode with auto-reload
```

### Project Structure
```
cb2fa/
├── src/              # Core application code
│   ├── main.ts       # Bot entry point
│   ├── client.ts     # Matrix client implementation
│   ├── config.ts     # Configuration management
│   ├── logger.ts     # Logging utilities
│   └── i18n.ts       # Internationalization
├── middleware.ts     # Authentication middleware
├── deno.json        # Deno configuration and tasks
├── db/              # SQLite database storage
├── logs/            # Application logs
└── screens/         # Documentation screenshots
```

## Current Status

### Implemented Features
- Matrix homeserver integration with Synapse
- Community-based approval workflow
- Multi-language interface support
- Request queue management system
- nginx middleware proxy integration
- systemd service configurations
- Comprehensive logging and monitoring
- Health check endpoints
- Configurable timeout management

### Known Limitations
- Matrix-only platform support (by design in v2.0.0)
- CLI-based setup (no web interface)
- Static trusted user configuration
- Single Matrix room per instance
- No REST API for external integrations

### Version History
- **v2.0.0** (2025-08-10) - Matrix-focused release, simplified architecture
- **v1.1.0** (2025-06-28) - Multi-platform mono-repository structure  
- **v1.0.0** (2025-01-28) - Initial public release

## Security Considerations

### Threat Model
- **Credential Validation:** All credentials verified with Synapse before community approval
- **Community Trust:** Security depends on trustworthiness of community members
- **Network Security:** Standard HTTPS/TLS protection required for Matrix communications
- **Queue Management:** Natural rate limiting prevents brute force attempts

### Best Practices
- **Trusted Users:** Carefully select community members with approval rights
- **Room Security:** Use encrypted Matrix rooms for sensitive environments
- **Network Isolation:** Deploy on isolated network segments when possible
- **Monitoring:** Regular review of authentication logs and decisions

## Contributing

Community contributions are welcome following these guidelines:

1. **Fork the repository** and create a feature branch
2. **Follow project architecture** - maintain modular, TypeScript-first approach
3. **Ensure compatibility** - test with supported Deno and Matrix versions
4. **Document changes** - update relevant documentation and comments
5. **Submit pull request** with clear description of changes

### Code Standards
- All code and comments in English
- TypeScript with strict type checking
- Functional programming patterns preferred
- Comprehensive error handling required

## Support Policy

**NO SUPPORT PROVIDED**: This project is released as-is without support, consultation, or assistance of any kind.

**Community Development**: Contributions are welcome but not obligated from project maintainers.

**Documentation Only**: All support information is provided through documentation.

## Legal Framework

### License
**MIT License** - Released by **EasyProTech LLC (www.easypro.tech)**  
**Lead Developer:** Brabus

### Disclaimer
This software is provided "as-is" without warranties. Users are responsible for compliance with applicable laws and regulations. See LICENSE file for complete terms.

### Usage Policy
- **Authorized Use Only** - Deploy only on systems you own or have explicit permission to modify
- **Legal Compliance** - Users responsible for adherence to local authentication and privacy laws
- **No Liability** - EasyProTech LLC assumes no responsibility for deployment outcomes

---

## Technical Specifications

### System Requirements
- **Deno Runtime:** 1.40.0 or higher
- **Node.js:** Not required (Deno-native implementation)
- **Operating System:** Linux, macOS, Windows (systemd services require Linux)
- **Memory:** Minimum 256MB RAM for basic deployment
- **Storage:** 100MB for application and logs

### Matrix Compatibility
- **Synapse:** Primary testing platform, fully supported
- **Dendrite:** Community-tested, basic compatibility
- **Conduit:** Untested, may require configuration adjustments
- **Matrix Version:** Supports Matrix Client-Server API v1.1+

### Performance Characteristics
- **Concurrent Requests:** Handles 100+ queued login attempts
- **Response Time:** Sub-second community notification delivery
- **Resource Usage:** Minimal CPU usage during idle periods
- **Scalability:** Single-instance design for security and simplicity

---

**CB2FA v2.0.0** | **EasyProTech LLC** | **Developer: Brabus** | **@easyprotech**

_Professional Authentication Solutions for Matrix Infrastructure_

**Deploy anywhere, configure everything, hardcode nothing.**