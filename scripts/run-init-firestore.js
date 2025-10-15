const { initializeFirestore } = require('./init-firestore.ts');

/**
 * Script ejecutable para inicializar la base de datos Firestore
 * Ejecutar con: node scripts/run-init-firestore.js
 */

async function main() {
  console.log('🚀 Iniciando configuración de base de datos Firestore...');
  console.log('📝 Asegúrate de que Firebase esté configurado correctamente');
  console.log('🔧 Verifica que las reglas de seguridad permitan escritura temporal');
  console.log('');
  
  try {
    await initializeFirestore();
    console.log('');
    console.log('✅ ¡Base de datos inicializada exitosamente!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Ve a Firebase Console > Firestore Database');
    console.log('2. Verifica que las colecciones se crearon correctamente');
    console.log('3. Configura las reglas de seguridad en Firebase Console');
    console.log('4. Crea los índices recomendados para mejor rendimiento');
    console.log('');
    console.log('🔒 Reglas de seguridad recomendadas:');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reportes: usuarios autenticados pueden crear, leer sus propios reportes
    match /security_reports/{reportId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.role in ['admin', 'police_officer']);
      allow update: if request.auth != null && 
        request.auth.token.role in ['admin', 'police_officer'];
    }
    
    // Incidentes: solo oficiales y administradores
    match /incidents/{incidentId} {
      allow read, write: if request.auth != null && 
        request.auth.token.role in ['admin', 'police_officer'];
    }
    
    // Notificaciones: usuarios solo pueden leer sus propias notificaciones
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Configuración del sistema: solo administradores
    match /system_config/{configId} {
      allow read, write: if request.auth != null && 
        request.auth.token.role == 'admin';
    }
  }
}
    `);
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    console.log('');
    console.log('🔧 Soluciones posibles:');
    console.log('1. Verifica que Firebase esté configurado correctamente');
    console.log('2. Asegúrate de tener permisos de escritura en Firestore');
    console.log('3. Verifica que las reglas de seguridad permitan escritura temporal');
    console.log('4. Revisa la consola de Firebase para más detalles del error');
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main };
