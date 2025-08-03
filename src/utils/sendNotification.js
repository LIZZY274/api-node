// utils/sendNotification.js
import admin from '../config/fireBase.js';
import * as FCMToken from '../models/FCMtoken.js';

// Enviar notificación de bienvenida al iniciar sesión
export const sendWelcomeNotification = async (userId, userName) => {
    try {
        const [tokens] = await FCMToken.getFCMTokensByUserId(userId);
        
        if (tokens.length === 0) {
            console.log(`No hay tokens FCM para el usuario ${userId}`);
            return;
        }

        const title = "¡Bienvenido de vuelta! 🚗";
        const body = `Hola ${userName}, tu sesión se ha iniciado correctamente`;
        
        const tokenStrings = tokens.map(t => t.token);
        
        const message = {
            notification: {
                title,
                body,
            },
            data: {
                type: 'login',
                userId: userId.toString(),
                timestamp: Date.now().toString()
            },
            tokens: tokenStrings,
            android: {
                notification: {
                    icon: 'ic_notification',
                    color: '#2196F3',
                    sound: 'default'
                }
            }
        };

        const response = await admin.messaging().sendMulticast(message);
        console.log(`✅ Notificación de login enviada: ${response.successCount}/${tokenStrings.length} dispositivos`);
        
    } catch (error) {
        console.error('❌ Error enviando notificación de bienvenida:', error);
    }
};