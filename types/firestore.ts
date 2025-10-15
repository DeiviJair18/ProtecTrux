import { Timestamp } from 'firebase/firestore';

// Tipos base para documentos de Firestore
export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Tipos para reportes de seguridad
export interface SecurityReport extends FirestoreDocument {
  userId: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  category: 'theft' | 'violence' | 'accident' | 'suspicious' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  images?: string[];
  assignedTo?: string;
  resolvedAt?: Timestamp;
  notes?: string;
}

// Tipos para incidentes
export interface Incident extends FirestoreDocument {
  reportId?: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  type: 'emergency' | 'patrol' | 'investigation' | 'traffic' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  assignedOfficers: string[];
  reportedBy: string;
  resolvedAt?: Timestamp;
  evidence?: {
    type: 'image' | 'video' | 'document';
    url: string;
    description?: string;
  }[];
}

// Tipos para patrullajes
export interface Patrol extends FirestoreDocument {
  officerId: string;
  route: {
    startLocation: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    endLocation?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    checkpoints: {
      latitude: number;
      longitude: number;
      address?: string;
      timestamp: Timestamp;
      notes?: string;
    }[];
  };
  startTime: Timestamp;
  endTime?: Timestamp;
  status: 'active' | 'completed' | 'interrupted';
  notes?: string;
  incidentsReported?: string[];
}

// Tipos para notificaciones
export interface Notification extends FirestoreDocument {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  read: boolean;
  actionUrl?: string;
  relatedDocumentId?: string;
  relatedCollection?: string;
}

// Tipos para configuración de la aplicación
export interface AppConfig extends FirestoreDocument {
  version: string;
  maintenanceMode: boolean;
  emergencyContacts: {
    name: string;
    phone: string;
    type: 'police' | 'fire' | 'medical' | 'other';
  }[];
  settings: {
    maxReportImages: number;
    autoAssignReports: boolean;
    notificationSettings: {
      pushEnabled: boolean;
      emailEnabled: boolean;
      smsEnabled: boolean;
    };
  };
}














