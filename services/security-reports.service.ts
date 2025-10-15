import { SecurityReport } from '@/types/firestore';
import { limit, orderBy, QueryConstraint, where } from 'firebase/firestore';
import { FirestoreService } from './firestore.service';
import { StorageService } from './storage.service';

export class SecurityReportsService {
  
  // Crear nuevo reporte de seguridad
  static async createReport(reportData: Omit<SecurityReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      return await FirestoreService.createDocument('security_reports', {
        ...reportData,
        status: 'pending' // Estado inicial
      });
    } catch (error) {
      console.error('Error creando reporte de seguridad:', error);
      throw new Error('Error al crear el reporte de seguridad');
    }
  }

  // Crear reporte con imágenes
  static async createReportWithImages(
    reportData: Omit<SecurityReport, 'id' | 'createdAt' | 'updatedAt' | 'images'>,
    imageFiles: (string | Blob)[]
  ): Promise<string> {
    try {
      let imageUrls: string[] = [];
      
      // Subir imágenes si se proporcionan
      if (imageFiles && imageFiles.length > 0) {
        const uploadResults = await StorageService.uploadMultipleImages(imageFiles, 'imagenes_reportes');
        imageUrls = uploadResults.map(result => result.url);
      }

      // Crear el reporte con las URLs de las imágenes
      return await FirestoreService.createDocument('security_reports', {
        ...reportData,
        images: imageUrls,
        status: 'pending'
      });
    } catch (error) {
      console.error('Error creando reporte con imágenes:', error);
      throw new Error('Error al crear el reporte con imágenes');
    }
  }

  // Obtener todos los reportes (para administradores)
  static async getAllReports(limitCount: number = 100): Promise<SecurityReport[]> {
    try {
      console.log('🔍 Obteniendo todos los reportes desde Firestore...');
      
      // Consulta simple sin filtros para obtener todos los reportes
      const constraints: QueryConstraint[] = [
        limit(limitCount)
      ];
      
      console.log('📋 Ejecutando consulta para todos los reportes');
      const reports = await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
      console.log('📊 Total de reportes encontrados:', reports.length);
      
      // Ordenar manualmente por fecha de creación (más reciente primero)
      const sortedReports = reports.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('✅ Todos los reportes ordenados y listos');
      return sortedReports;
    } catch (error) {
      console.error('❌ Error obteniendo todos los reportes:', error);
      throw new Error('Error al obtener todos los reportes');
    }
  }

  // Obtener reportes por usuario
  static async getReportsByUser(userId: string, limitCount: number = 50): Promise<SecurityReport[]> {
    try {
      console.log('🔍 Buscando reportes para usuario:', userId);
      
      // Consulta simplificada sin orderBy para evitar error de índice
      const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        limit(limitCount)
      ];
      
      console.log('📋 Ejecutando consulta con constraints:', constraints);
      const reports = await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
      console.log('📊 Reportes encontrados:', reports.length);
      
      // Ordenar manualmente por fecha de creación (más reciente primero)
      const sortedReports = reports.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      console.log('✅ Reportes ordenados y listos para mostrar');
      return sortedReports;
    } catch (error) {
      console.error('❌ Error obteniendo reportes del usuario:', error);
      throw new Error('Error al obtener los reportes del usuario');
    }
  }

  // Obtener reportes por estado
  static async getReportsByStatus(status: SecurityReport['status'], limitCount: number = 50): Promise<SecurityReport[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('status', '==', status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ];
      
      return await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
    } catch (error) {
      console.error('Error obteniendo reportes por estado:', error);
      throw new Error('Error al obtener los reportes por estado');
    }
  }

  // Obtener reportes por prioridad
  static async getReportsByPriority(priority: SecurityReport['priority'], limitCount: number = 50): Promise<SecurityReport[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('priority', '==', priority),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ];
      
      return await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
    } catch (error) {
      console.error('Error obteniendo reportes por prioridad:', error);
      throw new Error('Error al obtener los reportes por prioridad');
    }
  }

  // Obtener reportes por categoría
  static async getReportsByCategory(category: SecurityReport['category'], limitCount: number = 50): Promise<SecurityReport[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ];
      
      return await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
    } catch (error) {
      console.error('Error obteniendo reportes por categoría:', error);
      throw new Error('Error al obtener los reportes por categoría');
    }
  }

  // Asignar reporte a un oficial
  static async assignReport(reportId: string, officerId: string): Promise<void> {
    try {
      await FirestoreService.updateDocument<SecurityReport>('security_reports', reportId, {
        assignedTo: officerId,
        status: 'in_progress'
      });
    } catch (error) {
      console.error('Error asignando reporte:', error);
      throw new Error('Error al asignar el reporte');
    }
  }

  // Actualizar estado del reporte
  static async updateReportStatus(reportId: string, status: SecurityReport['status'], notes?: string): Promise<void> {
    try {
      const updateData: Partial<SecurityReport> = { status };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      if (status === 'resolved') {
        updateData.resolvedAt = new Date() as any; // Firestore convertirá a Timestamp
      }
      
      await FirestoreService.updateDocument<SecurityReport>('security_reports', reportId, updateData);
    } catch (error) {
      console.error('Error actualizando estado del reporte:', error);
      throw new Error('Error al actualizar el estado del reporte');
    }
  }

  // Obtener reporte por ID
  static async getReportById(reportId: string): Promise<SecurityReport | null> {
    try {
      return await FirestoreService.getDocumentById<SecurityReport>('security_reports', reportId);
    } catch (error) {
      console.error('Error obteniendo reporte por ID:', error);
      throw new Error('Error al obtener el reporte');
    }
  }

  // Obtener reportes recientes (últimas 24 horas)
  static async getRecentReports(limitCount: number = 20): Promise<SecurityReport[]> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const constraints: QueryConstraint[] = [
        where('createdAt', '>=', yesterday),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      ];
      
      return await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
    } catch (error) {
      console.error('Error obteniendo reportes recientes:', error);
      throw new Error('Error al obtener los reportes recientes');
    }
  }

  // Obtener reportes críticos pendientes
  static async getCriticalPendingReports(): Promise<SecurityReport[]> {
    try {
      const constraints: QueryConstraint[] = [
        where('priority', '==', 'critical'),
        where('status', 'in', ['pending', 'in_progress']),
        orderBy('createdAt', 'desc')
      ];
      
      return await FirestoreService.getDocuments<SecurityReport>('security_reports', constraints);
    } catch (error) {
      console.error('Error obteniendo reportes críticos:', error);
      throw new Error('Error al obtener los reportes críticos');
    }
  }

  // Eliminar reporte (solo para administradores)
  static async deleteReport(reportId: string): Promise<void> {
    try {
      await FirestoreService.deleteDocument('security_reports', reportId);
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      throw new Error('Error al eliminar el reporte');
    }
  }

  // Obtener estadísticas de reportes
  static async getReportsStatistics(): Promise<{
    total: number;
    byStatus: Record<SecurityReport['status'], number>;
    byPriority: Record<SecurityReport['priority'], number>;
    byCategory: Record<SecurityReport['category'], number>;
  }> {
    try {
      const allReports = await FirestoreService.getDocuments<SecurityReport>('security_reports');
      
      const stats = {
        total: allReports.length,
        byStatus: {
          pending: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0
        } as Record<SecurityReport['status'], number>,
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        } as Record<SecurityReport['priority'], number>,
        byCategory: {
          theft: 0,
          violence: 0,
          accident: 0,
          suspicious: 0,
          other: 0
        } as Record<SecurityReport['category'], number>
      };

      allReports.forEach(report => {
        stats.byStatus[report.status]++;
        stats.byPriority[report.priority]++;
        stats.byCategory[report.category]++;
      });

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error('Error al obtener las estadísticas');
    }
  }
}







