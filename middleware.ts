// CB2FA - Community-Based Two-Factor Authentication v2.0.0
// Company: EasyProTech LLC (www.easypro.tech)
// Dev: Brabus
// Created: 2025-08-10 21:40 MSK
// Telegram: https://t.me/easyprotech

// @ts-ignore
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { config } from "./src/config.ts";
import { log } from "./src/logger.ts";
import { t } from "./src/i18n.ts";

// Make Synapse URL configurable
const SYNAPSE_URL = config.matrix.homeserverUrl;
const CB2FA_BOT_URL = `http://127.0.0.1:${config.cb2fa.botPort}`;

log.info("🌐 Starting CB2FA Middleware...");
log.info(`Matrix domain: ${config.matrix.domain}`);
log.info(`Synapse URL: ${SYNAPSE_URL}`);
log.info(`CB2FA Bot URL: ${CB2FA_BOT_URL}`);

async function forwardToSynapse(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const synapseUrl = `${SYNAPSE_URL}${url.pathname}${url.search}`;

    log.debug(`Forwarding to Synapse: ${synapseUrl}`);

    const headers = new Headers(req.headers);
    headers.set("host", new URL(SYNAPSE_URL).host);
    headers.set("access-control-allow-origin", "*");

    const response = await fetch(synapseUrl, {
        method: req.method,
        headers,
        body: req.body,
    });

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Content-Type": "application/json",
    };

    return new Response(await response.text(), {
        status: response.status,
        headers: corsHeaders,
    });
}

async function interceptLogin(req: Request): Promise<Response> {
    try {
        const body = await req.text();
        const loginData = JSON.parse(body);

        log.info(`${t("loginAttempt")}: ${loginData.identifier?.user || loginData.user}`);

        // Forward to Synapse first to verify credentials (use same API version as request)
        const url = new URL(req.url);
        const synapseResponse = await fetch(`${SYNAPSE_URL}${url.pathname}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const synapseResult = await synapseResponse.json();

        if (!synapseResponse.ok) {
            log.warn(`${t("loginFailed")}: ${synapseResult.error || "Unknown error"}`);
            return new Response(JSON.stringify(synapseResult), {
                status: synapseResponse.status,
                headers: { 
                    "Access-Control-Allow-Origin": "*", 
                    "Content-Type": "application/json" 
                },
            });
        }

        const username = synapseResult.user_id.replace("@", "").split(":")[0];
        
        log.info(`✅ Login successful for: ${username}`);

        // Wait in queue if another request is being processed
        log.info(`${t("regularUser")}: ${username} - checking queue...`);
        
        let queueWaitTime = 0;
        while (true) {
            try {
                const hasPendingResponse = await fetch(`${CB2FA_BOT_URL}/cb2fa/has-pending`);
                if (hasPendingResponse.ok) {
                    const hasPendingData = await hasPendingResponse.json();
                    if (!hasPendingData.hasPending) {
                        log.info(`Queue clear for ${username}, proceeding...`);
                        break; // Queue is clear, we can proceed
                    }
                    log.debug(`${username} waiting in queue (${queueWaitTime}s)...`);
                }
            } catch (error) {
                log.warn(`Queue check error for ${username}:`, error);
                break; // If CB2FA service is down, proceed anyway
            }
            
            queueWaitTime += 2;
            if (queueWaitTime > 300) { // 5 minutes max queue wait
                log.warn(`Queue timeout for ${username} after ${queueWaitTime}s`);
                return new Response(JSON.stringify({
                    errcode: "M_FORBIDDEN",
                    error: "Invalid username or password",
                }), {
                    status: 403,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json",
                    },
                });
            }
            
            // Wait 2 seconds before checking again
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

        const authRequest = await fetch(`${CB2FA_BOT_URL}/cb2fa/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username,
                ip_address: clientIp,
                device_info: req.headers.get("user-agent"),
            }),
        });

        if (!authRequest.ok) {
            log.error("Failed to create CB2FA request");
            return new Response(JSON.stringify({
                errcode: "M_UNKNOWN",
                error: "CB2FA service unavailable",
            }), {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
            });
        }

        // Poll for simple y/n decision
        const maxWaitTime = config.cb2fa.timeoutMinutes * 60 * 1000;
        const pollInterval = 2000;
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));
            
            const statusResponse = await fetch(`${CB2FA_BOT_URL}/cb2fa/status`);
            
            if (statusResponse.ok) {
                const status = await statusResponse.json();
                
                if (status.status === "approved") {
                    log.info(`✅ CB2FA approved for ${username} by ${status.approvedBy}`);
                    return new Response(JSON.stringify(synapseResult), {
                        status: 200,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        },
                    });
                } else if (status.status === "denied") {
                    log.warn(`❌ CB2FA denied for ${username} by ${status.deniedBy}`);
                    return new Response(JSON.stringify({
                        errcode: "M_FORBIDDEN",
                        error: "Invalid username or password",
                    }), {
                        status: 403,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        },
                    });
                }
            }
        }

        // Timeout
        log.warn(`⏰ CB2FA timeout for ${username}`);
        return new Response(JSON.stringify({
            errcode: "M_FORBIDDEN",
            error: "Invalid username or password",
        }), {
            status: 403,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        log.error("Error in login interception:", error);
        return new Response(JSON.stringify({
            errcode: "M_UNKNOWN",
            error: "Internal server error",
        }), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
        });
    }
}

const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
            },
        });
    }

    // Health check
    if (url.pathname === "/health") {
        return new Response(JSON.stringify({ 
            status: "healthy",
            middleware: "cb2fa-v2",
            version: "2.0.0",
            domain: config.matrix.domain,
            synapse_url: SYNAPSE_URL,
            bot_url: CB2FA_BOT_URL
        }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    // Intercept login requests (both r0 and v3 API versions)
    if ((url.pathname === "/_matrix/client/r0/login" || url.pathname === "/_matrix/client/v3/login") && req.method === "POST") {
        return await interceptLogin(req);
    }

    // Forward everything else to Synapse
    return await forwardToSynapse(req);
};

await serve(handler, {
    port: config.cb2fa.middlewarePort,
    hostname: "127.0.0.1",
});
