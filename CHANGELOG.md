# Changelog

All notable changes to CB2FA (Community-Based Two-Factor Authentication) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] – 2025-08-10

### 🎯 Matrix-Focused Release 

**BREAKING CHANGES:**
- **Matrix-Only**: Removed all other platforms (Telegram, Discord, Slack) to focus purely on Matrix
- **New Structure**: Moved Matrix implementation from `/matrix` to project root
- **Simplified Architecture**: Single-platform focus for better stability and performance

### Added
- **New Project Structure**: Clean root-level organization (`src/`, `middleware.ts`)
- **Deno Tasks**: Added convenient `deno task start` and `deno task middleware` commands
- **Enhanced Headers**: All files now include proper company attribution and timestamps
- **Development Mode**: Added `deno task dev` with auto-reload

### Changed  
- **File Organization**: Matrix code moved from `/matrix/src/` to `/src/`
- **Import Paths**: Updated all imports for new structure
- **Documentation**: Completely rewritten README for v2.0 focus
- **Version Tracking**: Updated to v2.0.0 across all files

### Removed
- **Multi-Platform Support**: Removed Telegram, Discord, Slack implementations
- **Core Abstractions**: Removed `/core` directory as no longer needed
- **Architecture Docs**: Removed `/docs` as single-platform doesn't need complex docs

### Technical
- **Cleaner Codebase**: 60% reduction in complexity by removing multi-platform abstractions
- **Faster Startup**: Simplified initialization with single Matrix client
- **Better Maintainability**: Single focus means easier debugging and feature development

### Migration Guide
- **File Paths**: Update any scripts pointing to `/matrix/` paths
- **Commands**: Use new `deno task` commands instead of manual deno run
- **Configuration**: No changes needed to `.env` file

## [1.1.0] – 2025-06-28

- Repo converted to mono-structure
- Matrix implementation moved to `/matrix`
- Core architecture documentation started

## [1.0.0] – 2025-01-28

### Added
- **Initial public release**: CB2FA - Community-Based Two-Factor Authentication
- **Middleware system**: nginx proxy intercepting Matrix login requests
- **Bot integration**: Matrix bot for community approval via y/n commands  
- **Internationalization**: Support for 7 languages (EN/RU/DE/CN/FR/ES/TR)
- **Queue handling**: Smart queue system for multiple simultaneous login attempts
- **Clean UI**: Аккуратные таблицы showing login details in Matrix chat
- **Documentation**: Complete README in English and Russian with screenshots
- **Security**: Proper gitignore protecting sensitive data (.env, logs, db)
- **Portability**: Fully configurable via environment variables, no hardcoded domains
- **Anti-DDoS**: Natural rate limiting via community-based approval process

### Technical
- **TypeScript/Deno**: Modern backend with minimal dependencies
- **SQLite database**: Lightweight storage for queue management
- **Matrix client**: Direct integration with Matrix homeserver
- **nginx configuration**: Production-ready reverse proxy setup
- **SSL support**: Let's Encrypt integration for HTTPS

### Documentation
- README.md (English) with installation and usage instructions
- README_RU.md (Russian) with complete localization
- Real screenshots demonstrating CB2FA in action
- Configuration examples and deployment guide
- MIT License for open source community

---

**Made with ❤️ by EasyProTech LLC (www.easypro.tech)**  
**Developer: Brabus**
