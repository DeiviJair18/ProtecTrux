import { User } from '@/types/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../firebase.config';

export class FirestoreService {
  
  // Método genérico para crear documentos
  static async createDocument<T>(collectionName: string, data: T): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creando documento:', error);
      throw new Error('Error al crear el documento');
    }
  }

  // Método genérico para obtener un documento por ID
  static async getDocumentById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      throw new Error('Error al obtener el documento');
    }
  }

  // Método genérico para actualizar documentos
  static async updateDocument<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error actualizando documento:', error);
      throw new Error('Error al actualizar el documento');
    }
  }

  // Método genérico para eliminar documentos
  static async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error eliminando documento:', error);
      throw new Error('Error al eliminar el documento');
    }
  }

  // Método genérico para obtener documentos con filtros
  static async getDocuments<T>(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      throw new Error('Error al obtener los documentos');
    }
  }

  // Métodos específicos para usuarios
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<string> {
    return this.createDocument('users', userData);
  }

  static async getUserById(id: string): Promise<User | null> {
    return this.getDocumentById<User>('users', id);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getDocuments<User>('users', [
        where('email', '==', email),
        limit(1)
      ]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      throw new Error('Error al obtener el usuario');
    }
  }

  static async updateUser(id: string, userData: Partial<User>): Promise<void> {
    return this.updateDocument<User>('users', id, userData);
  }

  static async getActiveUsers(): Promise<User[]> {
    return this.getDocuments<User>('users', [
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getAllUsers(): Promise<User[]> {
    return this.getDocuments<User>('users', [
      orderBy('createdAt', 'desc')
    ]);
  }

  static async getUsersByRole(role: string): Promise<User[]> {
    try {
      console.log('🔍 Obteniendo usuarios por rol:', role);
      
      // Consulta simplificada sin orderBy para evitar error de índice
      const users = await this.getDocuments<User>('users', [
        where('role', '==', role)
      ]);
      
      console.log('📊 Usuarios encontrados para rol', role, ':', users.length);
      
      // Ordenar manualmente por fecha de creación (más reciente primero)
      return users.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('❌ Error obteniendo usuarios por rol:', error);
      throw new Error('Error al obtener los usuarios por rol');
    }
  }

  static async deleteUser(id: string): Promise<void> {
    return this.deleteDocument('users', id);
  }

  // Obtener información de usuario por ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      console.log('🔍 Obteniendo usuario por ID:', userId);
      const user = await this.getDocumentById<User>('users', userId);
      console.log('👤 Usuario encontrado:', user ? `${user.name} ${user.lastName}` : 'No encontrado');
      return user;
    } catch (error) {
      console.error('❌ Error obteniendo usuario por ID:', error);
      return null;
    }
  }

  static async toggleUserStatus(id: string, isActive: boolean): Promise<void> {
    return this.updateDocument('users', id, { isActive });
  }

  // Métodos para reportes de seguridad
  static async createSecurityReport(reportData: any): Promise<string> {
    return this.createDocument('security_reports', reportData);
  }

  static async getSecurityReports(userId?: string): Promise<any[]> {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    
    if (userId) {
      constraints.unshift(where('userId', '==', userId));
    }

    return this.getDocuments('security_reports', constraints);
  }

  // Métodos para incidentes
  static async createIncident(incidentData: any): Promise<string> {
    return this.createDocument('incidents', incidentData);
  }

  static async getIncidents(status?: string): Promise<any[]> {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
    
    if (status) {
      constraints.unshift(where('status', '==', status));
    }

    return this.getDocuments('incidents', constraints);
  }

  static async updateIncidentStatus(incidentId: string, status: string): Promise<void> {
    return this.updateDocument('incidents', incidentId, { status });
  }
}






