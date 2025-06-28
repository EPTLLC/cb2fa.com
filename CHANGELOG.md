# Changelog

All notable changes to CB2FA (Community-Based Two-Factor Authentication) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
