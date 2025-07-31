import * as NotificationSettings from '../models/NotificationSettings.js';

export const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const [settings] = await NotificationSettings.getNotificationSettings(userId);

    if (!settings.length) {
      await NotificationSettings.createNotificationSettings(userId);
      const [newSettings] = await NotificationSettings.getNotificationSettings(userId);
      
      res.json({
        success: true,
        data: {
          serviceReminders: newSettings[0].service_reminders,
          syncNotifications: newSettings[0].sync_notifications,
          offlineNotifications: newSettings[0].offline_notifications,
          errorNotifications: newSettings[0].error_notifications
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          serviceReminders: settings[0].service_reminders,
          syncNotifications: settings[0].sync_notifications,
          offlineNotifications: settings[0].offline_notifications,
          errorNotifications: settings[0].error_notifications
        }
      });
    }

  } catch (error) {
    console.error('Error obteniendo configuración de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceReminders, syncNotifications, offlineNotifications, errorNotifications } = req.body;

    await NotificationSettings.updateNotificationSettings(
      userId,
      serviceReminders,
      syncNotifications,
      offlineNotifications,
      errorNotifications
    );

    res.json({
      success: true,
      message: 'Configuración de notificaciones actualizada correctamente'
    });

  } catch (error) {
    console.error('Error actualizando configuración de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};