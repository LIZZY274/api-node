import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import './config/db.js';

dotenv.config();

const app = express();

// Middleware para parsing de JSON y URL encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware de logging mejorado
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log headers importantes
  if (req.headers.authorization) {
    console.log('🔑 Authorization header presente');
  }
  
  // Log para servicios
  if (req.path.includes('/services')) {
    console.log('🛠️ Petición a servicios detectada');
    if (req.method === 'POST') {
      console.log('📸 Creando servicio...');
      console.log('📄 Body:', JSON.stringify(req.body, null, 2));
    }
  }
  
  // Log de IP del cliente
  console.log('📍 IP Cliente:', req.ip || req.connection.remoteAddress);
  
  next();
});

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    features: ['autenticación', 'servicios', 'imágenes'],
    version: '2.0.0'
  });
});

// Ruta de prueba para imágenes
app.post('/api/test-image', (req, res) => {
  const { imagenUrl } = req.body;
  
  res.json({
    message: 'Test de imagen',
    hasImage: !!imagenUrl,
    imageLength: imagenUrl ? imagenUrl.length : 0,
    imagePreview: imagenUrl ? imagenUrl.substring(0, 100) + '...' : null
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🌐 Localhost: http://localhost:${PORT}`);
  console.log(`🌐 Red local: http://192.168.1.102:${PORT}`);
  console.log('📸 ✅ Soporte para imágenes HABILITADO');
});