import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import './config/db.js';

dotenv.config();

const app = express();


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  

  if (req.path.includes('/services') && req.method === 'POST') {
    console.log('📸 Creando servicio...');
    console.log('¿Tiene imagenUrl?', !!req.body.imagenUrl);
    if (req.body.imagenUrl) {
      console.log('📸 Imagen URL (primeros 50 chars):', req.body.imagenUrl.substring(0, 50) + '...');
    }
  }
  
  next();
});


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

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    features: ['autenticación', 'servicios', 'imágenes'],
    version: '2.0.0'
  });
});


app.post('/api/test-image', (req, res) => {
  const { imagenUrl } = req.body;
  
  res.json({
    message: 'Test de imagen',
    hasImage: !!imagenUrl,
    imageLength: imagenUrl ? imagenUrl.length : 0,
    imagePreview: imagenUrl ? imagenUrl.substring(0, 100) + '...' : null
  });
});

const PORT = 3000;

app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Servidor ejecutándose en puerto 3000');
  console.log('🌐 Localhost: http://localhost:3000');
  console.log('🌐 Red local: http://192.168.1.102:3000');
  console.log('📸 ✅ Soporte para imágenes HABILITADO');
});