// CB2FA - Community-Based Two-Factor Authentication v2.0.0
// Company: EasyProTech LLC (www.easypro.tech)
// Dev: Brabus
// Created: 2025-08-10 21:40 MSK
// Telegram: https://t.me/easyprotech

// @ts-ignore
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { config } from "./config.ts";
import { log } from "./logger.ts";
import { t, availableLanguages } from "./i18n.ts";
import { matrixClient } from "./client.ts";

log.info(t("botStarting"));
log.info(`Invited users: ${config.cb2fa.invitedUsers.join(", ")}`);
log.info(`Admin for auth: ${config.matrix.adminForAuth}`);
log.info(`Language: ${config.language} (${availableLanguages[config.language as keyof typeof availableLanguages] || config.language})`);
log.info(`Matrix domain: ${config.matrix.domain}`);

// Start Matrix client
await matrixClient.login();

// Start polling for messages
matrixClient.startPolling();

// HTTP server for CB2FA API
const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
        return new Response(JSON.stringify({ 
            status: "healthy", 
            language: config.language,
            domain: config.matrix.domain,
            version: "2.0.0",
            supportedLanguages: availableLanguages
        }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (url.pathname === "/cb2fa/has-pending" && req.method === "GET") {
        return new Response(JSON.stringify({
            hasPending: matrixClient.hasPendingRequest(),
        }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (url.pathname === "/cb2fa/create" && req.method === "POST") {
        try {
            const data = await req.json();
            
            const request = await matrixClient.sendLoginRequest(
                data.username,
                data.ip_address,
                data.device_info
            );
            
            return new Response(JSON.stringify(request), {
                headers: { "Content-Type": "application/json" },
            });
        } catch (error) {
            log.error("Error creating CB2FA request:", error);
            return new Response(JSON.stringify({
                error: "Failed to create request",
            }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
    }

    if (url.pathname === "/cb2fa/status" && req.method === "GET") {
        const currentRequest = matrixClient.getCurrentRequest();
        
        if (!currentRequest) {
            return new Response(JSON.stringify({
                error: "No pending request",
            }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }
        
        return new Response(JSON.stringify(currentRequest), {
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response("Not Found", { status: 404 });
};

await serve(handler, {
    port: config.cb2fa.botPort,
    hostname: "127.0.0.1",
});

log.info(`${t("httpServerStarted")} http://127.0.0.1:${config.cb2fa.botPort}`);
log.info(t("botStarted"));
log.info("🔑 Bot is ready for CB2FA requests!");
