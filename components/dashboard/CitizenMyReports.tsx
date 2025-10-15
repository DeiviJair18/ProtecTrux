import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ImageGallery } from '@/components/common/ImageGallery';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { FirestoreService } from '@/services/firestore.service';
import { SecurityReportsService } from '@/services/security-reports.service';
import { SecurityReport } from '@/types/firestore';
import { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CitizenMyReportsProps {
  onBack: () => void;
}

export function CitizenMyReports({ onBack }: CitizenMyReportsProps) {
  const { user } = useAuth();
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [officerNames, setOfficerNames] = useState<Record<string, string>>({});
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState<SecurityReport | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  // Cargar nombres de oficiales asignados
  const loadOfficerNames = async (reports: SecurityReport[]) => {
    try {
      const assignedOfficerIds = reports
        .filter(report => report.assignedTo)
        .map(report => report.assignedTo!)
        .filter((id, index, array) => array.indexOf(id) === index); // Eliminar duplicados

      console.log('👮 Cargando nombres de oficiales asignados:', assignedOfficerIds);

      const names: Record<string, string> = {};
      
      for (const officerId of assignedOfficerIds) {
        const officer = await FirestoreService.getUserById(officerId);
        if (officer) {
          names[officerId] = `${officer.name} ${officer.lastName}`;
        } else {
          names[officerId] = 'Oficial no encontrado';
        }
      }

      console.log('✅ Nombres de oficiales cargados:', names);
      setOfficerNames(names);
    } catch (error) {
      console.error('❌ Error cargando nombres de oficiales:', error);
    }
  };

  const loadReports = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userReports = await SecurityReportsService.getReportsByUser(user.id);
      setReports(userReports);
      
      // Cargar nombres de oficiales asignados
      await loadOfficerNames(userReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const openReportDetails = (report: SecurityReport) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const closeReportDetails = () => {
    setShowReportDetails(false);
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return SecurityColors.warning;
      case 'in_progress':
        return SecurityColors.info;
      case 'resolved':
        return SecurityColors.success;
      case 'closed':
        return SecurityColors.text.secondary;
      default:
        return SecurityColors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Proceso';
      case 'resolved':
        return 'Resuelto';
      case 'closed':
        return 'Cerrado';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return SecurityColors.success;
      case 'medium':
        return SecurityColors.warning;
      case 'high':
        return SecurityColors.danger;
      case 'critical':
        return SecurityColors.danger;
      default:
        return SecurityColors.text.secondary;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Baja';
      case 'medium':
        return 'Media';
      case 'high':
        return 'Alta';
      case 'critical':
        return 'Crítica';
      default:
        return priority;
    }
  };

  const formatDate = (date: any) => {
    let reportDate: Date;
    
    // Manejar fechas de Firestore (Timestamp o Date)
    if (date && typeof date.toDate === 'function') {
      reportDate = date.toDate();
    } else if (date instanceof Date) {
      reportDate = date;
    } else {
      reportDate = new Date(date);
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(reportDate.getTime())) {
      return 'Fecha no disponible';
    }
    
    return reportDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'theft':
        return 'Robo';
      case 'violence':
        return 'Violencia';
      case 'accident':
        return 'Accidente';
      case 'suspicious':
        return 'Actividad Sospechosa';
      case 'other':
        return 'Otro';
      default:
        return category;
    }
  };


  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const statusFilters = [
    { value: 'all', label: 'Todos', count: reports.length },
    { value: 'pending', label: 'Pendientes', count: reports.filter(r => r.status === 'pending').length },
    { value: 'in_progress', label: 'En Proceso', count: reports.filter(r => r.status === 'in_progress').length },
    { value: 'resolved', label: 'Resueltos', count: reports.filter(r => r.status === 'resolved').length },
    { value: 'closed', label: 'Cerrados', count: reports.filter(r => r.status === 'closed').length },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Mis Reportes</ThemedText>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <SecurityIcon name="search" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{reports.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Reportes</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {reports.filter(r => r.status === 'resolved').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Resueltos</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {reports.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Activos</ThemedText>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <ThemedText style={styles.sectionTitle}>Filtrar por Estado</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  filterStatus === filter.value && styles.filterChipActive
                ]}
                onPress={() => setFilterStatus(filter.value as any)}
              >
                <ThemedText
                  style={[
                    styles.filterText,
                    filterStatus === filter.value && styles.filterTextActive
                  ]}
                >
                  {filter.label} ({filter.count})
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <ThemedText style={styles.sectionTitle}>
            Reportes ({filteredReports.length})
          </ThemedText>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ThemedText style={styles.loadingText}>Cargando reportes...</ThemedText>
            </View>
          ) : filteredReports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <SecurityIcon name="document" size={48} color={SecurityColors.text.secondary} />
              <ThemedText style={styles.emptyTitle}>No hay reportes</ThemedText>
              <ThemedText style={styles.emptyText}>
                {filterStatus === 'all' 
                  ? 'Aún no has creado ningún reporte'
                  : `No hay reportes con estado "${getStatusText(filterStatus)}"`
                }
              </ThemedText>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {filteredReports.map((report) => (
                <TouchableOpacity 
                  key={report.id} 
                  style={styles.reportCard}
                  onPress={() => openReportDetails(report)}
                >
                  <View style={styles.reportHeader}>
                    <View style={styles.reportTitleContainer}>
                      <ThemedText style={styles.reportTitle} numberOfLines={1}>
                        {report.title}
                      </ThemedText>
                      <View style={styles.reportBadges}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                          <ThemedText style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                            {getStatusText(report.status)}
                          </ThemedText>
                        </View>
                        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) + '20' }]}>
                          <ThemedText style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
                            {getPriorityText(report.priority)}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    <SecurityIcon name="chevron-forward" size={20} color={SecurityColors.text.secondary} />
                  </View>
                  
                  <ThemedText style={styles.reportDescription} numberOfLines={2}>
                    {report.description}
                  </ThemedText>
                  
                  {/* Imágenes del reporte */}
                  {report.images && report.images.length > 0 && (
                    <ImageGallery 
                      images={report.images} 
                      maxPreview={3}
                      showCount={true}
                    />
                  )}
                  
                  <View style={styles.reportDetails}>
                    <View style={styles.reportDetail}>
                      <SecurityIcon name="folder" size={16} color={SecurityColors.text.secondary} />
                      <ThemedText style={styles.reportDetailText}>
                        {getCategoryText(report.category)}
                      </ThemedText>
                    </View>
                    <View style={styles.reportDetail}>
                      <SecurityIcon name="location" size={16} color={SecurityColors.text.secondary} />
                      <ThemedText style={styles.reportDetailText} numberOfLines={1}>
                        {report.location.address || 'Ubicación no especificada'}
                      </ThemedText>
                    </View>
                    {report.assignedTo && (
                      <View style={styles.reportDetail}>
                        <SecurityIcon name="person" size={16} color={SecurityColors.status.info} />
                        <ThemedText style={styles.reportDetailText}>
                          Asignado a: {officerNames[report.assignedTo] || report.assignedTo}
                        </ThemedText>
                      </View>
                    )}
                    <View style={styles.reportDetail}>
                      <SecurityIcon name="time" size={16} color={SecurityColors.text.secondary} />
                      <ThemedText style={styles.reportDetailText}>
                        {formatDate(report.createdAt)}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de detalles del reporte */}
      <Modal
        visible={showReportDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={closeReportDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Detalles del Reporte</ThemedText>
              <TouchableOpacity onPress={closeReportDetails}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedReport && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <ThemedText style={styles.detailTitle}>{selectedReport.title}</ThemedText>
                  <View style={styles.detailMeta}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(selectedReport.priority) + '20' }]}>
                      <ThemedText style={[styles.priorityText, { color: getPriorityColor(selectedReport.priority) }]}>
                        {getPriorityText(selectedReport.priority)}
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.status) + '20' }]}>
                      <ThemedText style={[styles.statusText, { color: getStatusColor(selectedReport.status) }]}>
                        {getStatusText(selectedReport.status)}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Descripción</ThemedText>
                  <ThemedText style={styles.detailText}>{selectedReport.description}</ThemedText>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Ubicación</ThemedText>
                  <View style={styles.locationContainer}>
                    <SecurityIcon name="location" size={20} color={SecurityColors.status.info} />
                    <ThemedText style={styles.locationText}>
                      {selectedReport.location.address || 'Ubicación no especificada'}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Categoría</ThemedText>
                  <ThemedText style={styles.detailText}>{getCategoryText(selectedReport.category)}</ThemedText>
                </View>

                {selectedReport.assignedTo && (
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Asignado a</ThemedText>
                    <View style={styles.assignedContainer}>
                      <SecurityIcon name="person" size={20} color={SecurityColors.status.info} />
                      <ThemedText style={styles.assignedText}>
                        {officerNames[selectedReport.assignedTo] || selectedReport.assignedTo}
                      </ThemedText>
                    </View>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Fechas</ThemedText>
                  <ThemedText style={styles.dateText}>Creado: {formatDate(selectedReport.createdAt)}</ThemedText>
                  {selectedReport.updatedAt && (
                    <ThemedText style={styles.dateText}>Actualizado: {formatDate(selectedReport.updatedAt)}</ThemedText>
                  )}
                </View>

                {selectedReport.images && selectedReport.images.length > 0 && (
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Imágenes ({selectedReport.images.length})</ThemedText>
                    <ImageGallery 
                      images={selectedReport.images} 
                      maxPreview={5}
                      showCount={true}
                    />
                  </View>
                )}
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeReportDetails}
              >
                <ThemedText style={styles.closeButtonText}>Cerrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    minHeight: 80,
    backgroundColor: SecurityColors.background.light,
    borderBottomWidth: 1,
    borderBottomColor: SecurityColors.border.light,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  filtersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 12,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: SecurityColors.border.light,
  },
  filterChipActive: {
    backgroundColor: SecurityColors.primary,
    borderColor: SecurityColors.primary,
  },
  filterText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  filterTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  reportsSection: {
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: SecurityColors.border.light,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reportTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 8,
  },
  reportBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  reportDetails: {
    gap: 8,
  },
  reportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportDetailText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    flex: 1,
  },
  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  modalBody: {
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 8,
  },
  detailMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: SecurityColors.text.primary,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assignedText: {
    fontSize: 14,
    color: SecurityColors.text.primary,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    marginBottom: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  closeButton: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: SecurityColors.text.secondary,
    fontWeight: '600',
  },
});
