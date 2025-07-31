import { pool } from '../config/db.js';

export const createNotificationSettings = (userId, serviceReminders = true, syncNotifications = true, offlineNotifications = true, errorNotifications = true) =>
  pool.query(
    'INSERT INTO notification_settings (user_id, service_reminders, sync_notifications, offline_notifications, error_notifications) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE service_reminders = VALUES(service_reminders), sync_notifications = VALUES(sync_notifications), offline_notifications = VALUES(offline_notifications), error_notifications = VALUES(error_notifications), updated_at = NOW()',
    [userId, serviceReminders, syncNotifications, offlineNotifications, errorNotifications]
  );

export const getNotificationSettings = (userId) =>
  pool.query(
    'SELECT * FROM notification_settings WHERE user_id = ?',
    [userId]
  );

export const updateNotificationSettings = (userId, serviceReminders, syncNotifications, offlineNotifications, errorNotifications) =>
  pool.query(
    'UPDATE notification_settings SET service_reminders = ?, sync_notifications = ?, offline_notifications = ?, error_notifications = ?, updated_at = NOW() WHERE user_id = ?',
    [serviceReminders, syncNotifications, offlineNotifications, errorNotifications, userId]
  );

export const deleteNotificationSettings = (userId) =>
  pool.query(
    'DELETE FROM notification_settings WHERE user_id = ?',
    [userId]
  );