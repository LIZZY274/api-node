import admin from 'firebase-admin';
import serviceAccount from '../privates/Notification.json' assert { type: 'json' };

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
    });
    
    console.log('✅ Firebase Admin inicializado correctamente');
    console.log(`📱 Proyecto: ${serviceAccount.project_id}`);
} else {
    console.log('📱 Firebase Admin ya estaba inicializado');
}

export default admin;