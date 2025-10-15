const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');

// Configuración de Firebase (usa las mismas credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyCVFNYzk553daFAAi5fNtd86fNwRqEONa4",
  authDomain: "protectrux.firebaseapp.com",
  projectId: "protectrux",
  storageBucket: "protectrux.firebasestorage.app",
  messagingSenderId: "108690240801",
  appId: "1:108690240801:web:4f18dd85376a8980df3a60",
  measurementId: "G-T2DN3XQ7C1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeDatabase() {
  console.log('🚀 Inicializando base de datos SecureTrux...');
  
  try {
    // 1. Crear usuarios de ejemplo
    console.log('👥 Creando usuarios de ejemplo...');
    
    const usersCollection = collection(db, 'users');
    
    // Usuario administrador
    await setDoc(doc(usersCollection, 'admin-example'), {
      email: 'admin@securetrux.com',
      name: 'Administrador',
      lastName: 'Sistema',
      phoneNumber: '+51999999999',
      role: 'admin',
      badge: 'ADM001',
      department: 'Administración',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Usuario policía
    await setDoc(doc(usersCollection, 'police-example'), {
      email: 'policia@securetrux.com',
      name: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+51988888888',
      role: 'police_officer',
      badge: 'POL001',
      department: 'Policía Nacional',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Usuario ciudadano
    await setDoc(doc(usersCollection, 'citizen-example'), {
      email: 'ciudadano@securetrux.com',
      name: 'María',
      lastName: 'González',
      phoneNumber: '+51977777777',
      role: 'citizen',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ Usuarios creados');
    
    // 2. Crear reporte de ejemplo
    console.log('📋 Creando reporte de ejemplo...');
    
    const reportsCollection = collection(db, 'security_reports');
    await setDoc(doc(reportsCollection, 'report-example'), {
      userId: 'citizen-example',
      userEmail: 'ciudadano@securetrux.com',
      userName: 'María González',
      type: 'theft',
      title: 'Robo en el centro de Trujillo',
      description: 'Se reporta un robo a mano armada en la Plaza de Armas',
      location: {
        address: 'Plaza de Armas, Trujillo',
        coordinates: {
          latitude: -8.1115,
          longitude: -79.0289
        }
      },
      severity: 'high',
      status: 'pending',
      priority: 'urgent',
      assignedTo: null,
      assignedAt: null,
      resolvedAt: null,
      evidence: [],
      witnesses: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ Reporte creado');
    
    // 3. Crear incidente de ejemplo
    console.log('🚨 Creando incidente de ejemplo...');
    
    const incidentsCollection = collection(db, 'incidents');
    await setDoc(doc(incidentsCollection, 'incident-example'), {
      reportId: 'report-example',
      assignedTo: 'police-example',
      assignedToEmail: 'policia@securetrux.com',
      status: 'in_progress',
      priority: 'high',
      responseTime: null,
      resolutionTime: null,
      notes: 'Patrulla en camino al lugar del incidente',
      actions: [
        {
          action: 'Patrulla despachada',
          timestamp: Timestamp.now(),
          officer: 'Juan Pérez'
        }
      ],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ Incidente creado');
    
    // 4. Crear configuración del sistema
    console.log('⚙️ Creando configuración del sistema...');
    
    const configCollection = collection(db, 'system_config');
    await setDoc(doc(configCollection, 'general'), {
      appName: 'SecureTrux',
      version: '1.0.0',
      maintenanceMode: false,
      emergencyMode: false,
      maxReportDistance: 5000,
      responseTimeLimit: 15,
      supportedReportTypes: [
        'theft',
        'assault',
        'vandalism',
        'suspicious_activity',
        'emergency',
        'traffic_violation'
      ],
      supportedSeverityLevels: [
        'low',
        'medium',
        'high',
        'critical'
      ],
      notificationSettings: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('✅ Configuración creada');
    
    // 5. Crear notificación de ejemplo
    console.log('🔔 Creando notificación de ejemplo...');
    
    const notificationsCollection = collection(db, 'notifications');
    await setDoc(doc(notificationsCollection, 'notification-example'), {
      userId: 'citizen-example',
      type: 'report_status_update',
      title: 'Actualización de tu reporte',
      message: 'Tu reporte de seguridad ha sido asignado a un oficial',
      data: {
        reportId: 'report-example',
        status: 'assigned'
      },
      read: false,
      sentAt: Timestamp.now(),
      readAt: null,
      createdAt: Timestamp.now()
    });
    
    console.log('✅ Notificación creada');
    
    console.log('');
    console.log('🎉 ¡Base de datos inicializada exitosamente!');
    console.log('');
    console.log('📊 Colecciones creadas:');
    console.log('  - users (usuarios del sistema)');
    console.log('  - security_reports (reportes de seguridad)');
    console.log('  - incidents (incidentes asignados)');
    console.log('  - system_config (configuración del sistema)');
    console.log('  - notifications (notificaciones)');
    console.log('');
    console.log('👤 Usuarios de ejemplo creados:');
    console.log('  - admin@securetrux.com (Administrador)');
    console.log('  - policia@securetrux.com (Oficial de Policía)');
    console.log('  - ciudadano@securetrux.com (Ciudadano)');
    console.log('');
    console.log('🔒 Próximos pasos:');
    console.log('1. Ve a Firebase Console > Firestore Database');
    console.log('2. Verifica que las colecciones se crearon');
    console.log('3. Configura las reglas de seguridad');
    console.log('4. Crea usuarios reales desde tu app');
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('1. Verifica que Firebase esté configurado correctamente');
    console.log('2. Asegúrate de tener permisos de escritura en Firestore');
    console.log('3. Verifica que las reglas de seguridad permitan escritura');
    console.log('4. Revisa la consola de Firebase para más detalles');
    process.exit(1);
  }
}

// Ejecutar la inicialización
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
