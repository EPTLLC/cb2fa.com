 # CB2FA – Community-Based Two-Factor Authentication

**CB2FA** is a revolutionary trust-based authentication model where access is approved by humans, not devices.

> **No OTP. No phones. No secrets. Just people.**

## 🔍 The Problem

Traditional 2FA relies on:
- 📱 **Devices you can lose**
- 🔑 **Secrets you can forget** 
- 🤖 **Apps that can break**

## 💡 The CB2FA Solution

**Community-Based 2FA** relies on:
- 👥 **People you trust**
- 💬 **Simple y/n decisions**
- 🌐 **Platforms you already use**

When someone tries to log in, your trusted community members get a notification and can approve or deny the request in real-time.

## 🔧 Implementations

- ✅ **[Matrix Integration](./matrix)** – Deno-based bot + middleware for Matrix homeservers
- ⏳ **Telegram Integration** (planned) – Bot for Telegram groups
- ⏳ **Discord Integration** (planned) – Bot for Discord servers  
- ⏳ **Webhook Mode** (planned) – Generic HTTP callbacks for any app
- ⏳ **Slack Integration** (planned) – Slack app for teams

## 🌍 Internationalization

CB2FA supports **7 languages** out of the box:
- 🇬🇧 **English** 
- 🇷🇺 **Russian** (Русский)
- 🇩🇪 **German** (Deutsch)
- 🇨🇳 **Chinese Simplified** (中文简体)
- 🇫🇷 **French** (Français)
- 🇪🇸 **Spanish** (Español)
- 🇹🇷 **Turkish** (Türkçe)

Each implementation loads translations via environment variables.

## 🏗️ Architecture

CB2FA follows a **modular architecture**:

```
Login Request → Implementation → Queue → Community → Decision → Access
```

### Core Components:
- **Queue System** – One active request at a time, others wait
- **Trust Model** – Community members approve/deny access
- **I18n System** – Multi-language support
- **Middleware** – Protocol-specific interceptors

## 📖 Documentation

- 📋 [Architecture Overview](./docs/architecture.md)
- 🔄 [How CB2FA Works](./docs/how-it-works.md) 
- 🚀 [Getting Started](./matrix/README.md) (Matrix implementation)

## 🤝 Contributing

CB2FA is open source and welcomes contributions:
- 🐛 **Bug reports** – Open an issue
- 💡 **Feature requests** – Discuss in issues
- 🔧 **Code contributions** – Submit pull requests
- 🌍 **Translations** – Add new languages
- 📖 **Documentation** – Improve guides

## 📞 Support

I do not provide support. I do not consult — not for free, not for money, not in any form.

Please don't ask for help, fixes, or explanations — this project is released as-is.

If someone wants to help with development — contributions are welcome. But there are no obligations from my side whatsoever.

## 📜 License

**MIT License** – Released by **[EasyProTech LLC](https://www.easypro.tech)**  
**Lead Developer:** Brabus

---

**Deploy anywhere, configure everything, hardcode nothing!** 🚀