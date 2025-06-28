// CB2FA - Community-Based Two-Factor Authentication
// Made for Matrix with love by EasyProTech LLC (www.easypro.tech)
// Developer: Brabus

export const log = {
    info: (message: string, ...args: unknown[]) => console.log(`[INFO] ${message}`, ...args),
    warn: (message: string, ...args: unknown[]) => console.warn(`[WARN] ${message}`, ...args),
    error: (message: string, ...args: unknown[]) => console.error(`[ERROR] ${message}`, ...args),
    debug: (message: string, ...args: unknown[]) => console.debug(`[DEBUG] ${message}`, ...args),
};
