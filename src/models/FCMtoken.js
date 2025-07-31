import { pool } from '../config/db.js';

export const createFCMToken = (userId, fcmToken, deviceType, appVersion) =>
  pool.query(
    'INSERT INTO fcm_tokens (user_id, fcm_token, device_type, app_version) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE fcm_token = VALUES(fcm_token), device_type = VALUES(device_type), app_version = VALUES(app_version), updated_at = NOW()',
    [userId, fcmToken, deviceType, appVersion]
  );

export const getFCMTokensByUserId = (userId) =>
  pool.query(
    'SELECT * FROM fcm_tokens WHERE user_id = ? AND is_active = 1',
    [userId]
  );

export const getAllActiveFCMTokens = () =>
  pool.query(
    'SELECT * FROM fcm_tokens WHERE is_active = 1'
  );

export const deleteFCMToken = (userId, fcmToken) =>
  pool.query(
    'UPDATE fcm_tokens SET is_active = 0 WHERE user_id = ? AND fcm_token = ?',
    [userId, fcmToken]
  );

export const deleteFCMTokensByUserId = (userId) =>
  pool.query(
    'UPDATE fcm_tokens SET is_active = 0 WHERE user_id = ?',
    [userId]
  );

export const getFCMTokenByToken = (fcmToken) =>
  pool.query(
    'SELECT * FROM fcm_tokens WHERE fcm_token = ? AND is_active = 1',
    [fcmToken]
  );

export const updateFCMTokenActivity = (fcmToken, isActive) =>
  pool.query(
    'UPDATE fcm_tokens SET is_active = ?, updated_at = NOW() WHERE fcm_token = ?',
    [isActive, fcmToken]
  );