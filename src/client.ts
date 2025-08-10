// CB2FA - Community-Based Two-Factor Authentication v2.0.0
// Company: EasyProTech LLC (www.easypro.tech)
// Dev: Brabus
// Created: 2025-08-10 21:40 MSK
// Telegram: https://t.me/easyprotech

import { config } from "./config.ts";
import { log } from "./logger.ts";
import { t } from "./i18n.ts";

export class MatrixClient {
    private accessToken = "";
    private roomId = "";
    private currentRequest: any = null;
    
    async login() {
        const response = await fetch(`${config.matrix.homeserverUrl}/_matrix/client/v3/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "m.login.password",
                identifier: {
                    type: "m.id.user",
                    user: config.matrix.botUsername,
                },
                password: config.matrix.botPassword,
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Login failed: ${await response.text()}`);
        }
        
        const data = await response.json();
        this.accessToken = data.access_token;
        log.info(t("loggedIn"));
        
        await this.setupRoom();
    }
    
    async setupRoom() {
        // Get joined rooms
        const roomsResponse = await fetch(`${config.matrix.homeserverUrl}/_matrix/client/v3/joined_rooms`, {
            headers: { "Authorization": `Bearer ${this.accessToken}` },
        });
        
        if (!roomsResponse.ok) {
            throw new Error("Failed to get rooms");
        }
        
        const roomsData = await roomsResponse.json();
        
        // Look for CB2FA room
        for (const roomId of roomsData.joined_rooms) {
            const stateResponse = await fetch(
                `${config.matrix.homeserverUrl}/_matrix/client/v3/rooms/${roomId}/state/m.room.name`,
                { headers: { "Authorization": `Bearer ${this.accessToken}` } }
            );
            
            if (stateResponse.ok) {
                const state = await stateResponse.json();
                if (state.name === config.cb2fa.roomName) {
                    this.roomId = roomId;
                    log.info(`${t("roomFound")}: ${roomId}`);
                    return;
                }
            }
        }
        
        // Create room if not found
        const createResponse = await fetch(`${config.matrix.homeserverUrl}/_matrix/client/v3/createRoom`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: config.cb2fa.roomName,
                topic: "CB2FA authorization - simple y/n commands",
                visibility: "private",
                preset: "private_chat",
            }),
        });
        
        if (!createResponse.ok) {
            throw new Error("Failed to create room");
        }
        
        const createData = await createResponse.json();
        this.roomId = createData.room_id;
        log.info(`${t("roomCreated")}: ${this.roomId}`);
        
        // Invite all configured users immediately
        for (const user of config.cb2fa.invitedUsers) {
            const userId = `@${user}:${config.matrix.domain}`;
            await this.inviteUser(userId);
        }
    }
    
    async inviteUser(userId: string) {
        const response = await fetch(
            `${config.matrix.homeserverUrl}/_matrix/client/v3/rooms/${this.roomId}/invite`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_id: userId }),
            }
        );
        
        if (response.ok) {
            log.info(`Invited ${userId} to room`);
        }
    }
    
    async sendMessage(message: string) {
        const txnId = Date.now().toString();
        const response = await fetch(
            `${config.matrix.homeserverUrl}/_matrix/client/v3/rooms/${this.roomId}/send/m.room.message/${txnId}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    msgtype: "m.text",
                    body: message,
                    format: "org.matrix.custom.html",
                    formatted_body: message
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/`(.*?)`/g, "<code>$1</code>")
                        .replace(/\n/g, "<br/>"),
                }),
            }
        );
        
        if (!response.ok) {
            log.error("Failed to send message:", await response.text());
        }
    }

    async sendFormattedMessage(htmlContent: string, plainTextFallback: string) {
        const txnId = Date.now().toString();
        const response = await fetch(
            `${config.matrix.homeserverUrl}/_matrix/client/v3/rooms/${this.roomId}/send/m.room.message/${txnId}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${this.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    msgtype: "m.text",
                    body: plainTextFallback,
                    format: "org.matrix.custom.html",
                    formatted_body: htmlContent,
                }),
            }
        );
        
        if (!response.ok) {
            log.error("Failed to send formatted message:", await response.text());
        } else {
            log.info("✅ Sent table to Matrix");
        }
    }
    
    async sendLoginRequest(username: string, ipAddress: string, deviceInfo?: string) {
        const requestId = crypto.randomUUID();
        const timestamp = new Date().toLocaleTimeString();
        
        this.currentRequest = {
            id: requestId,
            username,
            ipAddress,
            deviceInfo,
            timestamp,
            status: "pending",
        };
        
        // Create clean table with HTML formatting
        const deviceRow = deviceInfo ? `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f8f9fa;">${t("device")}:</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${deviceInfo}</td>
                    </tr>` : "";

        const htmlTable = `
<h3>🔐 ${t("loginRequest")}</h3>
<table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 10px 0;">
    <tbody>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f8f9fa; width: 120px;">${t("user")}:</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace; font-weight: bold;">${username}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f8f9fa;">${t("ip")}:</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${ipAddress}</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold; background-color: #f8f9fa;">${t("time")}:</td>
            <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${timestamp}</td>
        </tr>${deviceRow}
    </tbody>
</table>
<p style="background-color: #e8f4fd; padding: 10px; border-left: 4px solid #007acc; margin: 10px 0;">
    <strong>📋 ${t("replyInstructions")}</strong>
</p>`;

        const plainTextTable = `🔐 ${t("loginRequest")}

${t("user")}: ${username}
${t("ip")}: ${ipAddress}  
${t("time")}: ${timestamp}
${deviceInfo ? `${t("device")}: ${deviceInfo}` : ""}

📋 ${t("replyInstructions")}`;

        await this.sendFormattedMessage(htmlTable, plainTextTable);
        
        log.info(`${t("requestCreated")} ${username} (${requestId.substring(0, 8)})`);
        
        return this.currentRequest;
    }
    
    async startPolling() {
        let nextBatch = "";
        
        // Get initial sync token
        const syncResponse = await fetch(
            `${config.matrix.homeserverUrl}/_matrix/client/v3/sync?timeout=0`,
            { headers: { "Authorization": `Bearer ${this.accessToken}` } }
        );
        
        if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            nextBatch = syncData.next_batch;
        }
        
        // Poll for new messages
        while (true) {
            try {
                const response = await fetch(
                    `${config.matrix.homeserverUrl}/_matrix/client/v3/sync?since=${nextBatch}&timeout=30000`,
                    { headers: { "Authorization": `Bearer ${this.accessToken}` } }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    nextBatch = data.next_batch;
                    
                    // Process room events
                    if (data.rooms?.join?.[this.roomId]?.timeline?.events) {
                        for (const event of data.rooms.join[this.roomId].timeline.events) {
                            if (event.type === "m.room.message" && event.content?.msgtype === "m.text") {
                                await this.processMessage(event);
                            }
                        }
                    }
                }
            } catch (error) {
                log.error("Sync error:", error);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
    
    async processMessage(event: any) {
        const sender = event.sender;
        const message = event.content?.body?.trim().toLowerCase();
        
        if (!sender || !message) return;
        
        // Skip bot's own messages
        if (sender === `@${config.matrix.botUsername}:${config.matrix.domain}`) {
            return;
        }
        
        const username = sender.split(":")[0].replace("@", "");
        
        // Handle y/n responses to current request  
        if (this.currentRequest && (message === "y" || message === "n")) {
            if (message === "y") {
                this.currentRequest.status = "approved";
                this.currentRequest.approvedBy = username;
                await this.sendMessage(`${t("requestApproved")} by ${username}`);
                log.info(`Request approved by ${username}`);
            } else {
                this.currentRequest.status = "denied"; 
                this.currentRequest.deniedBy = username;
                await this.sendMessage(`${t("requestDenied")} by ${username}`);
                log.info(`Request denied by ${username}`);
            }
            
            // Clear current request after decision
            setTimeout(() => {
                this.currentRequest = null;
            }, 1000);
        }
    }
    
    getCurrentRequest() {
        return this.currentRequest;
    }
    
    hasPendingRequest(): boolean {
        return this.currentRequest !== null;
    }
}

export const matrixClient = new MatrixClient();
