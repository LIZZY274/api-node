// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import fcmRoutes from './routes/fcmRoutes.js'; // 🔔 NUEVA RUTA FCM

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Log de requests (opcional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);           // Rutas de autenticación
app.use('/api/services', serviceRoutes);    // Rutas de servicios  
app.use('/api/fcm', fcmRoutes);            // 🔔 RUTAS FCM (NUEVA)

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AutoTrack API',
    version: '1.0.0'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🚗 AutoTrack API',
    endpoints: {
      auth: '/api/auth',
      services: '/api/services',
      fcm: '/api/fcm',
      health: '/health'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rutas no encontradas (404)
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/fcm/token',
      'GET /api/services',
      'POST /api/services'
    ]
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 Servidor AutoTrack iniciado`);
  console.log(`🚀 Puerto: ${PORT}`);
  console.log(`🚀 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ================================');
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`⚙️  Services: http://localhost:${PORT}/api/services`);
  console.log(`🔔 FCM: http://localhost:${PORT}/api/fcm`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log('🚀 ================================');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

export default app;