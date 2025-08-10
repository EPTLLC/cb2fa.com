// CB2FA - Community-Based Two-Factor Authentication v2.0.0
// Company: EasyProTech LLC (www.easypro.tech)
// Dev: Brabus
// Created: 2025-08-10 21:40 MSK
// Telegram: https://t.me/easyprotech

export const log = {
    info: (message: string, ...args: unknown[]) => console.log(`[INFO] ${message}`, ...args),
    warn: (message: string, ...args: unknown[]) => console.warn(`[WARN] ${message}`, ...args),
    error: (message: string, ...args: unknown[]) => console.error(`[ERROR] ${message}`, ...args),
    debug: (message: string, ...args: unknown[]) => console.debug(`[DEBUG] ${message}`, ...args),
};
