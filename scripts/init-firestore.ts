import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { UserRole } from '../types/auth';

/**
 * Script para inicializar la base de datos Firestore con las colecciones y datos necesarios
 * para el sistema SecureTrux
 */

export class FirestoreInitializer {
  
  // Crear colecciones principales
  static async initializeCollections() {
    console.log('🚀 Inicializando colecciones de Firestore...');
    
    try {
      // 1. Crear colección de usuarios con documento de ejemplo
      await this.createUsersCollection();
      
      // 2. Crear colección de reportes de seguridad
      await this.createSecurityReportsCollection();
      
      // 3. Crear colección de incidentes
      await this.createIncidentsCollection();
      
      // 4. Crear colección de configuraciones del sistema
      await this.createSystemConfigCollection();
      
      // 5. Crear colección de notificaciones
      await this.createNotificationsCollection();
      
      console.log('✅ Colecciones inicializadas correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando colecciones:', error);
      throw error;
    }
  }

  // Crear colección de usuarios con datos de ejemplo
  private static async createUsersCollection() {
    console.log('👥 Creando colección de usuarios...');
    
    const usersCollection = collection(db, 'users');
    
    // Usuario administrador de ejemplo
    const adminUser = {
      email: 'admin@securetrux.com',
      name: 'Administrador',
      lastName: 'Sistema',
      phoneNumber: '+51999999999',
      role: UserRole.ADMIN,
      badge: 'ADM001',
      department: 'Administración',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(usersCollection, 'admin-example'), adminUser);
    
    // Usuario policía de ejemplo
    const policeUser = {
      email: 'policia@securetrux.com',
      name: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+51988888888',
      role: UserRole.POLICE_OFFICER,
      badge: 'POL001',
      department: 'Policía Nacional',
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(usersCollection, 'police-example'), policeUser);
    
    // Usuario ciudadano de ejemplo
    const citizenUser = {
      email: 'ciudadano@securetrux.com',
      name: 'María',
      lastName: 'González',
      phoneNumber: '+51977777777',
      role: UserRole.CITIZEN,
      isActive: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(doc(usersCollection, 'citizen-example'), citizenUser);
    
    console.log('✅ Colección de usuarios creada con usuarios de ejemplo');
  }

  // Crear colección de reportes de seguridad
  private static async createSecurityReportsCollection() {
    console.log('📋 Creando colección de reportes de seguridad...');
    
    const reportsCollection = collection(db, 'security_reports');
    
    // Reporte de ejemplo
    const exampleReport = {
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
    };
    
    await setDoc(doc(reportsCollection, 'report-example'), exampleReport);
    
    console.log('✅ Colección de reportes de seguridad creada');
  }

  // Crear colección de incidentes
  private static async createIncidentsCollection() {
    console.log('🚨 Creando colección de incidentes...');
    
    const incidentsCollection = collection(db, 'incidents');
    
    // Incidente de ejemplo
    const exampleIncident = {
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
    };
    
    await setDoc(doc(incidentsCollection, 'incident-example'), exampleIncident);
    
    console.log('✅ Colección de incidentes creada');
  }

  // Crear colección de configuraciones del sistema
  private static async createSystemConfigCollection() {
    console.log('⚙️ Creando colección de configuraciones del sistema...');
    
    const configCollection = collection(db, 'system_config');
    
    // Configuración general del sistema
    const systemConfig = {
      appName: 'SecureTrux',
      version: '1.0.0',
      maintenanceMode: false,
      emergencyMode: false,
      maxReportDistance: 5000, // metros
      responseTimeLimit: 15, // minutos
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
    };
    
    await setDoc(doc(configCollection, 'general'), systemConfig);
    
    console.log('✅ Colección de configuraciones del sistema creada');
  }

  // Crear colección de notificaciones
  private static async createNotificationsCollection() {
    console.log('🔔 Creando colección de notificaciones...');
    
    const notificationsCollection = collection(db, 'notifications');
    
    // Notificación de ejemplo
    const exampleNotification = {
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
    };
    
    await setDoc(doc(notificationsCollection, 'notification-example'), exampleNotification);
    
    console.log('✅ Colección de notificaciones creada');
  }

  // Crear índices compuestos recomendados (documentación)
  static getRecommendedIndexes() {
    return {
      users: [
        'email (ascending)',
        'role (ascending), isActive (ascending)',
        'department (ascending), isActive (ascending)'
      ],
      security_reports: [
        'userId (ascending), createdAt (descending)',
        'status (ascending), priority (ascending)',
        'type (ascending), createdAt (descending)',
        'assignedTo (ascending), status (ascending)'
      ],
      incidents: [
        'assignedTo (ascending), status (ascending)',
        'status (ascending), priority (ascending)',
        'reportId (ascending)'
      ],
      notifications: [
        'userId (ascending), read (ascending), sentAt (descending)',
        'type (ascending), sentAt (descending)'
      ]
    };
  }
}

// Función para ejecutar la inicialización
export async function initializeFirestore() {
  try {
    await FirestoreInitializer.initializeCollections();
    console.log('🎉 Base de datos Firestore inicializada correctamente');
    console.log('📊 Índices recomendados:');
    console.log(JSON.stringify(FirestoreInitializer.getRecommendedIndexes(), null, 2));
  } catch (error) {
    console.error('💥 Error inicializando Firestore:', error);
    throw error;
  }
}
