# CB2FA Architecture

## Overview

CB2FA (Community-Based Two-Factor Authentication) is a **trust-based authentication platform** that replaces traditional device-based 2FA with human community approval.

## Core Principles

### 1. Human Trust Over Device Trust
- Traditional 2FA: "Something you have" (phone, token)
- CB2FA: "Someone you trust" (community members)

### 2. Real-time Approval
- Login attempts create instant notifications
- Community members respond with simple y/n
- Access granted immediately upon approval

### 3. Platform Agnostic
- Works with any authentication system
- Middleware intercepts login requests
- Decisions routed through various platforms (Matrix, Telegram, etc.)

## System Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ User Login  │───▶│ Middleware   │───▶│ Queue       │───▶│ Community    │
│ Attempt     │    │ (Intercept)  │    │ (1 at time) │    │ Platform     │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘
                                                                  │
┌─────────────┐    ┌──────────────┐    ┌─────────────┐           │
│ Access      │◀───│ Auth Server  │◀───│ Decision    │◀──────────┘
│ Granted     │    │ (Original)   │    │ (y/n)       │
└─────────────┘    └──────────────┘    └─────────────┘
```

## Components

### 1. Middleware Layer
**Purpose**: Intercept authentication requests before they reach the original auth server.

**Responsibilities**:
- Validate credentials with original server
- Create approval requests if credentials are valid
- Queue multiple simultaneous requests
- Forward final decision to auth server

**Implementations**:
- **nginx proxy** (Matrix)
- **HTTP middleware** (Web apps)
- **Bot commands** (Telegram/Discord)

### 2. Queue System
**Purpose**: Manage multiple login attempts without overwhelming community.

**Features**:
- ✅ **One active request** at a time
- ✅ **Automatic queuing** of additional requests  
- ✅ **Anti-spam protection** via natural rate limiting
- ✅ **Timeout handling** for expired requests

### 3. Community Platform Integration
**Purpose**: Send approval requests to trusted community members.

**Supported Platforms**:
- **Matrix** – Rooms with trusted users
- **Telegram** – Private groups (planned)
- **Discord** – Private channels (planned)
- **Slack** – Private channels (planned)

### 4. Trust Model
**Philosophy**: If you trust someone with the keys to your community platform, you can trust them to approve your logins.

**Implementation**:
- Community platform membership = CB2FA approval rights
- No additional user management needed
- Natural abuse protection through platform controls

## Security Model

### Threat Protection

**✅ Credential Stuffing**: Invalid credentials rejected before CB2FA
**✅ DDoS Protection**: Queue system prevents overwhelming community  
**✅ Social Engineering**: Community members see all login details
**✅ Device Theft**: No device needed, community approval required
**✅ Insider Threats**: Multiple community members can see requests

### Trust Assumptions

**🎯 Community Platform Security**: CB2FA inherits security of underlying platform (Matrix encryption, Telegram security, etc.)

**🎯 Community Member Trust**: Users must trust their community members with login decisions

**🎯 Network Security**: Standard HTTPS/TLS protection for auth requests

---

**CB2FA: Trust people, not devices.** 🤝
