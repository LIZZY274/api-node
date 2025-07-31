import * as FCMToken from '../models/FCMtoken.js';

export const updateFCMToken = async (req, res) => {
  try {
    const { fcmToken, deviceType = 'android', appVersion = '1.0.0' } = req.body;
    const userId = req.user.id;

    if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: 'FCM token es requerido'
      });
    }

    await FCMToken.createFCMToken(userId, fcmToken, deviceType, appVersion);

    res.json({
      success: true,
      message: 'FCM token actualizado correctamente',
      tokenId: fcmToken.substring(0, 20) + '...'
    });

  } catch (error) {
    console.error('Error actualizando FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const deleteFCMToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fcmToken } = req.body;

    if (fcmToken) {
      await FCMToken.deleteFCMToken(userId, fcmToken);
    } else {
      await FCMToken.deleteFCMTokensByUserId(userId);
    }

    res.json({
      success: true,
      message: 'FCM token eliminado correctamente'
    });

  } catch (error) {
    console.error('Error eliminando FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserFCMTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    const [tokens] = await FCMToken.getFCMTokensByUserId(userId);

    res.json({
      success: true,
      data: tokens.map(token => ({
        id: token.id,
        deviceType: token.device_type,
        appVersion: token.app_version,
        createdAt: token.created_at,
        updatedAt: token.updated_at
      })),
      message: `${tokens.length} tokens encontrados`
    });

  } catch (error) {
    console.error('Error obteniendo FCM tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const { userIds, topic, title, body, data, type } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Título y mensaje son requeridos'
      });
    }

    let targetTokens = [];

    if (userIds && userIds.length > 0) {
      for (const userId of userIds) {
        const [tokens] = await FCMToken.getFCMTokensByUserId(userId);
        targetTokens.push(...tokens.map(token => token.fcm_token));
      }
    } else if (topic) {
      console.log(`Enviando notificación al tópico: ${topic}`);
      
      res.json({
        success: true,
        message: `Notificación enviada al tópico: ${topic}`,
        targetType: 'topic'
      });
      return;
    } else {
      const [allTokens] = await FCMToken.getAllActiveFCMTokens();
      targetTokens = allTokens.map(token => token.fcm_token);
    }

    if (targetTokens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron tokens FCM activos'
      });
    }

    console.log(`Enviando notificación a ${targetTokens.length} dispositivos`);

    res.json({
      success: true,
      message: `Notificación enviada a ${targetTokens.length} dispositivos`,
      targetCount: targetTokens.length,
      targetType: 'tokens'
    });

  } catch (error) {
    console.error('Error enviando notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};