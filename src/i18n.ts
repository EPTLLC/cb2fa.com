// CB2FA - Community-Based Two-Factor Authentication v2.0.0
// Company: EasyProTech LLC (www.easypro.tech)
// Dev: Brabus
// Created: 2025-08-10 21:40 MSK
// Telegram: https://t.me/easyprotech

import { config } from "./config.ts";

const messages = {
    en: {
        botStarting: "🚀 Starting CB2FA Matrix Bot...",
        loggedIn: "✅ Logged in to Matrix successfully",
        roomCreated: "✅ Created CB2FA room",
        roomFound: "✅ Found CB2FA room",
        botReady: "✅ CB2FA Bot ready",
        httpServerStarted: "🌐 HTTP server started on",
        botStarted: "🎯 CB2FA Bot started successfully!",
        
        loginRequest: "🔐 Login Request",
        user: "User",
        ip: "IP",
        time: "Time", 
        device: "Device",
        replyInstructions: "Reply: y (allow) / n (deny)",
        
        requestApproved: "✅ Request APPROVED",
        requestDenied: "❌ Request DENIED",
        
        botAuthRequest: "🤖 CB2FA bot requests verification. Reply 'y' to authorize this bot",
        botAuthorized: "✅ CB2FA bot authorized successfully",
        
        loginAttempt: "🔐 Login attempt",
        loginFailed: "❌ Login failed",
        regularUser: "🔄 Regular user - creating CB2FA request",
        requestCreated: "📝 Created auth request for",
    },
    ru: {
        botStarting: "🚀 Запуск CB2FA Matrix Бота...",
        loggedIn: "✅ Успешный вход в Matrix",
        roomCreated: "✅ Создана CB2FA комната",
        roomFound: "✅ Найдена CB2FA комната", 
        botReady: "✅ CB2FA Бот готов",
        httpServerStarted: "🌐 HTTP сервер запущен на",
        botStarted: "🎯 CB2FA Бот успешно запущен!",
        
        loginRequest: "🔐 Запрос входа",
        user: "Пользователь",
        ip: "IP",
        time: "Время",
        device: "Устройство",
        replyInstructions: "Ответ: y (разрешить) / n (запретить)",
        
        requestApproved: "✅ Запрос ОДОБРЕН",
        requestDenied: "❌ Запрос ОТКЛОНЕН",
        
        botAuthRequest: "🤖 CB2FA бот запрашивает авторизацию. Ответьте 'y' чтобы авторизовать",
        botAuthorized: "✅ CB2FA бот успешно авторизован",
        
        loginAttempt: "🔐 Попытка входа",
        loginFailed: "❌ Неудачный вход",
        regularUser: "🔄 Обычный пользователь - создаем CB2FA запрос", 
        requestCreated: "📝 Создан запрос авторизации для",
    },
    de: {
        botStarting: "🚀 CB2FA Matrix Bot wird gestartet...",
        loggedIn: "✅ Erfolgreich in Matrix eingeloggt",
        roomCreated: "✅ CB2FA Raum erstellt",
        roomFound: "✅ CB2FA Raum gefunden",
        botReady: "✅ CB2FA Bot bereit",
        httpServerStarted: "🌐 HTTP Server gestartet auf",
        botStarted: "🎯 CB2FA Bot erfolgreich gestartet!",
        
        loginRequest: "🔐 Anmeldeanfrage",
        user: "Benutzer",
        ip: "IP",
        time: "Zeit",
        device: "Gerät",
        replyInstructions: "Antwort: y (erlauben) / n (verweigern)",
        
        requestApproved: "✅ Anfrage GENEHMIGT",
        requestDenied: "❌ Anfrage ABGELEHNT",
        
        botAuthRequest: "🤖 CB2FA Bot bittet um Verifizierung. Antworten Sie 'y' um diesen Bot zu autorisieren",
        botAuthorized: "✅ CB2FA Bot erfolgreich autorisiert",
        
        loginAttempt: "🔐 Anmeldeversuch",
        loginFailed: "❌ Anmeldung fehlgeschlagen",
        regularUser: "🔄 Regulärer Benutzer - erstelle CB2FA Anfrage",
        requestCreated: "📝 Autorisierungsanfrage erstellt für",
    },
    "zh-cn": {
        botStarting: "🚀 正在启动CB2FA Matrix机器人...",
        loggedIn: "✅ 成功登录Matrix",
        roomCreated: "✅ 已创建CB2FA房间",
        roomFound: "✅ 找到CB2FA房间",
        botReady: "✅ CB2FA机器人已就绪",
        httpServerStarted: "🌐 HTTP服务器已启动在",
        botStarted: "🎯 CB2FA机器人启动成功!",
        
        loginRequest: "🔐 登录请求",
        user: "用户",
        ip: "IP地址",
        time: "时间",
        device: "设备",
        replyInstructions: "回复: y (允许) / n (拒绝)",
        
        requestApproved: "✅ 请求已批准",
        requestDenied: "❌ 请求已拒绝",
        
        botAuthRequest: "🤖 CB2FA机器人请求验证。回复'y'以授权此机器人",
        botAuthorized: "✅ CB2FA机器人授权成功",
        
        loginAttempt: "🔐 登录尝试",
        loginFailed: "❌ 登录失败",
        regularUser: "🔄 普通用户 - 创建CB2FA请求",
        requestCreated: "📝 已为以下用户创建授权请求",
    },
    fr: {
        botStarting: "🚀 Démarrage du bot CB2FA Matrix...",
        loggedIn: "✅ Connexion à Matrix réussie",
        roomCreated: "✅ Salon CB2FA créé",
        roomFound: "✅ Salon CB2FA trouvé",
        botReady: "✅ Bot CB2FA prêt",
        httpServerStarted: "🌐 Serveur HTTP démarré sur",
        botStarted: "🎯 Bot CB2FA démarré avec succès!",
        
        loginRequest: "🔐 Demande de connexion",
        user: "Utilisateur",
        ip: "IP",
        time: "Heure",
        device: "Appareil",
        replyInstructions: "Réponse: y (autoriser) / n (refuser)",
        
        requestApproved: "✅ Demande APPROUVÉE",
        requestDenied: "❌ Demande REFUSÉE",
        
        botAuthRequest: "🤖 Le bot CB2FA demande une vérification. Répondez 'y' pour autoriser ce bot",
        botAuthorized: "✅ Bot CB2FA autorisé avec succès",
        
        loginAttempt: "🔐 Tentative de connexion",
        loginFailed: "❌ Échec de la connexion",
        regularUser: "🔄 Utilisateur régulier - création d'une demande CB2FA",
        requestCreated: "📝 Demande d'autorisation créée pour",
    },
    es: {
        botStarting: "🚀 Iniciando bot CB2FA Matrix...",
        loggedIn: "✅ Sesión iniciada en Matrix correctamente",
        roomCreated: "✅ Sala CB2FA creada",
        roomFound: "✅ Sala CB2FA encontrada",
        botReady: "✅ Bot CB2FA listo",
        httpServerStarted: "🌐 Servidor HTTP iniciado en",
        botStarted: "🎯 ¡Bot CB2FA iniciado correctamente!",
        
        loginRequest: "🔐 Solicitud de inicio de sesión",
        user: "Usuario",
        ip: "IP",
        time: "Hora",
        device: "Dispositivo",
        replyInstructions: "Respuesta: y (permitir) / n (denegar)",
        
        requestApproved: "✅ Solicitud APROBADA",
        requestDenied: "❌ Solicitud DENEGADA",
        
        botAuthRequest: "🤖 El bot CB2FA solicita verificación. Responda 'y' para autorizar este bot",
        botAuthorized: "✅ Bot CB2FA autorizado correctamente",
        
        loginAttempt: "🔐 Intento de inicio de sesión",
        loginFailed: "❌ Fallo en el inicio de sesión",
        regularUser: "🔄 Usuario regular - creando solicitud CB2FA",
        requestCreated: "📝 Solicitud de autorización creada para",
    },
    tr: {
        botStarting: "🚀 CB2FA Matrix botu başlatılıyor...",
        loggedIn: "✅ Matrix'e başarıyla giriş yapıldı",
        roomCreated: "✅ CB2FA odası oluşturuldu",
        roomFound: "✅ CB2FA odası bulundu",
        botReady: "✅ CB2FA botu hazır",
        httpServerStarted: "🌐 HTTP sunucusu başlatıldı",
        botStarted: "🎯 CB2FA botu başarıyla başlatıldı!",
        
        loginRequest: "🔐 Giriş talebi",
        user: "Kullanıcı",
        ip: "IP",
        time: "Zaman",
        device: "Cihaz",
        replyInstructions: "Yanıt: y (izin ver) / n (reddet)",
        
        requestApproved: "✅ Talep ONAYLANDI",
        requestDenied: "❌ Talep REDDEDİLDİ",
        
        botAuthRequest: "🤖 CB2FA botu doğrulama talep ediyor. Bu botu yetkilendirmek için 'y' yanıtlayın",
        botAuthorized: "✅ CB2FA botu başarıyla yetkilendirildi",
        
        loginAttempt: "🔐 Giriş denemesi",
        loginFailed: "❌ Giriş başarısız",
        regularUser: "🔄 Normal kullanıcı - CB2FA talebi oluşturuluyor",
        requestCreated: "📝 Yetkilendirme talebi oluşturuldu:",
    }
};

export const t = (key: string): string => {
    const lang = config.language as keyof typeof messages;
    const langMessages = messages[lang] || messages.en;
    return (langMessages as any)[key] || key;
};

// Export available languages for documentation
export const availableLanguages = {
    "en": "🇬🇧 English",
    "ru": "🇷🇺 Русский", 
    "de": "🇩🇪 Deutsch",
    "zh-cn": "🇨🇳 中文 (简体)",
    "fr": "🇫🇷 Français",
    "es": "🇪🇸 Español",
    "tr": "🇹🇷 Türkçe"
};
