// controllers/fcmController.js
import * as FCMToken from '../models/FCMtoken.js';

// Registrar token FCM
export const registerFCMToken = async (req, res) => {
  try {
    const { token, deviceId, deviceName } = req.body;
    const userId = req.user.id;

    if (!token || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Token FCM y Device ID son requeridos'
      });
    }

    console.log(`📱 Registrando token FCM para usuario ${userId}, dispositivo: ${deviceId}`);
    
    await FCMToken.saveOrUpdateFCMToken(userId, token, deviceId, deviceName);

    console.log(`✅ Token FCM registrado exitosamente para usuario ${userId}`);

    res.json({
      success: true,
      message: 'Token FCM registrado exitosamente'
    });

  } catch (error) {
    console.error('Error registrando token FCM:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};