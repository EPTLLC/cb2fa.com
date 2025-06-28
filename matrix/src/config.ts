// CB2FA - Community-Based Two-Factor Authentication
// Made for Matrix with love by EasyProTech LLC (www.easypro.tech)
// Developer: Brabus

import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

await load({ export: true });

export const config = {
    matrix: {
        homeserverUrl: Deno.env.get("MATRIX_HOMESERVER_URL") || "http://localhost:8008",
        botUsername: Deno.env.get("MATRIX_BOT_USERNAME") || "cb2fa_bot", 
        botPassword: Deno.env.get("MATRIX_BOT_PASSWORD") || "",
        domain: Deno.env.get("MATRIX_DOMAIN") || "localhost",
        adminForAuth: Deno.env.get("MATRIX_ADMIN_FOR_AUTH") || "admin",
    },
    cb2fa: {
        invitedUsers: (Deno.env.get("CB2FA_INVITED_USERS") || "admin").split(",").map(u => u.trim()),
        roomName: Deno.env.get("CB2FA_ROOM_NAME") || "CB2FA Authorization",
        timeoutMinutes: parseInt(Deno.env.get("CB2FA_TIMEOUT_MINUTES") || "15"),
        botPort: parseInt(Deno.env.get("CB2FA_BOT_PORT") || "10000"),
        middlewarePort: parseInt(Deno.env.get("CB2FA_MIDDLEWARE_PORT") || "9999"),
    },
    // Fix: TEST_LANG should override LANGUAGE for testing
    language: Deno.env.get("TEST_LANG") || Deno.env.get("LANGUAGE") || "en",
};
