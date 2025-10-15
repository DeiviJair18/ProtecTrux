import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { FirestoreService } from '@/services/firestore.service';
import { SecurityReportsService } from '@/services/security-reports.service';
import { User } from '@/types/auth';
import { SecurityReport } from '@/types/firestore';
import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

// Usar SecurityReport del tipo Firestore
type Report = SecurityReport;

interface ReportsManagementProps {
  onBack: () => void;
}

export function ReportsManagement({ onBack }: ReportsManagementProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTo, setAssignTo] = useState('');
  const [availableOfficers, setAvailableOfficers] = useState<User[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<User | null>(null);
  const [loadingOfficers, setLoadingOfficers] = useState(false);
  const [officerNames, setOfficerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    loadReports();
  }, []);

  // Cargar nombres de oficiales asignados
  const loadOfficerNames = async (reports: Report[]) => {
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

  const loadAvailableOfficers = async () => {
    try {
      setLoadingOfficers(true);
      console.log('👮 Cargando oficiales disponibles...');
      
      // Cargar usuarios con roles apropiados para asignar reportes
      const policeOfficers = await FirestoreService.getUsersByRole('police_officer');
      const securityGuards = await FirestoreService.getUsersByRole('security_guard');
      const emergencyResponders = await FirestoreService.getUsersByRole('emergency_responder');
      
      // Filtrar solo usuarios activos
      const allOfficers = [...policeOfficers, ...securityGuards, ...emergencyResponders]
        .filter(user => user.isActive);
      
      console.log('✅ Oficiales cargados:', allOfficers.length);
      setAvailableOfficers(allOfficers);
    } catch (error) {
      console.error('❌ Error cargando oficiales:', error);
      Alert.alert('Error', 'No se pudieron cargar los oficiales disponibles');
    } finally {
      setLoadingOfficers(false);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando reportes desde Firestore...');
      
      // Cargar todos los reportes desde Firestore
      const allReports = await SecurityReportsService.getAllReports();
      
      console.log('✅ Reportes cargados exitosamente:', allReports.length);
      console.log('📊 Reportes encontrados:', allReports.map(r => ({ 
        id: r.id, 
        title: r.title, 
        status: r.status,
        createdAt: r.createdAt 
      })));
      
      setReports(allReports);
      
      // Cargar nombres de oficiales asignados
      await loadOfficerNames(allReports);
    } catch (error) {
      console.error('❌ Error cargando reportes:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes desde la base de datos');
    } finally {
      setLoading(false);
    }
  };

  const getTypeDisplayName = (category: string) => {
    switch (category) {
      case 'theft':
        return 'Robo';
      case 'emergency':
        return 'Emergencia';
      case 'vandalism':
        return 'Vandalismo';
      case 'suspicious':
        return 'Actividad Sospechosa';
      case 'accident':
        return 'Accidente';
      case 'fire':
        return 'Incendio';
      default:
        return 'Otro';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'resolved':
        return 'Resuelto';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return SecurityColors.status.danger;
      case 'high':
        return SecurityColors.status.warning;
      case 'medium':
        return SecurityColors.status.info;
      case 'low':
        return SecurityColors.status.safe;
      default:
        return SecurityColors.text.secondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return SecurityColors.status.warning;
      case 'in_progress':
        return SecurityColors.status.info;
      case 'resolved':
        return SecurityColors.status.safe;
      case 'cancelled':
        return SecurityColors.status.danger;
      default:
        return SecurityColors.text.secondary;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.category === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      console.log('🔄 Actualizando estado del reporte:', reportId, 'a', newStatus);
      
      // Actualizar en la base de datos usando el servicio
      await SecurityReportsService.updateReportStatus(reportId, newStatus as any);
      
      // Actualizar el estado local después de guardar en la base de datos
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus, updatedAt: new Date() }
          : report
      ));
      
      console.log('✅ Estado del reporte actualizado exitosamente en la base de datos');
      
      // Recargar los reportes para asegurar sincronización
      await loadReports();
      
      Alert.alert('Éxito', 'Estado del reporte actualizado correctamente');
    } catch (error) {
      console.error('❌ Error actualizando estado del reporte:', error);
      Alert.alert('Error', 'No se pudo actualizar el reporte en la base de datos');
    }
  };

  const assignReport = async (reportId: string, officerId: string) => {
    try {
      console.log('👤 Asignando reporte:', reportId, 'a oficial:', officerId);
      
      // Actualizar en la base de datos usando el servicio
      await SecurityReportsService.assignReport(reportId, officerId);
      
      // Actualizar el estado local después de guardar en la base de datos
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, assignedTo: officerId, status: 'in_progress', updatedAt: new Date() }
          : report
      ));
      
      console.log('✅ Reporte asignado exitosamente en la base de datos');
      
      // Recargar los reportes para asegurar sincronización
      await loadReports();
      
      Alert.alert('Éxito', 'Reporte asignado correctamente');
      setShowAssignModal(false);
      setAssignTo('');
      setSelectedOfficer(null);
    } catch (error) {
      console.error('❌ Error asignando reporte:', error);
      Alert.alert('Error', 'No se pudo asignar el reporte en la base de datos');
    }
  };

  const openReportDetails = (report: Report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'police_officer':
        return 'Oficial de Policía';
      case 'security_guard':
        return 'Agente de Seguridad';
      case 'emergency_responder':
        return 'Respondedor de Emergencias';
      case 'admin':
        return 'Administrador';
      default:
        return 'Ciudadano';
    }
  };

  const getTimeAgo = (date: any) => {
    const now = new Date();
    let reportDate: Date;
    
    // Manejar fechas de Firestore (Timestamp o Date)
    if (date && typeof date.toDate === 'function') {
      reportDate = date.toDate();
    } else if (date instanceof Date) {
      reportDate = date;
    } else {
      reportDate = new Date(date);
    }
    
    const diffInMinutes = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <SecurityIcon name="menu" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.headerTitle}>Gestión de Reportes</ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <SecurityIcon name="filter" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtros y búsqueda */}
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <SecurityIcon name="search" size={20} color={SecurityColors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar reportes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={SecurityColors.text.secondary}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'Todos' },
              { key: 'pending', label: 'Pendientes' },
              { key: 'in_progress', label: 'En Progreso' },
              { key: 'resolved', label: 'Resueltos' }
            ].map(status => (
              <TouchableOpacity
                key={status.key}
                style={[
                  styles.filterTab,
                  filterStatus === status.key && styles.filterTabActive
                ]}
                onPress={() => setFilterStatus(status.key)}
              >
                <ThemedText style={[
                  styles.filterTabText,
                  filterStatus === status.key && styles.filterTabTextActive
                ]}>
                  {status.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {[
            { key: 'all', label: 'Todos los tipos' },
            { key: 'theft', label: 'Robo' },
            { key: 'emergency', label: 'Emergencia' },
            { key: 'vandalism', label: 'Vandalismo' },
            { key: 'suspicious', label: 'Sospechoso' }
          ].map(type => (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.filterTab,
                filterType === type.key && styles.filterTabActive
              ]}
              onPress={() => setFilterType(type.key)}
            >
              <ThemedText style={[
                styles.filterTabText,
                filterType === type.key && styles.filterTabTextActive
              ]}>
                {type.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de reportes */}
      <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
        {filteredReports.map(report => (
          <TouchableOpacity 
            key={report.id} 
            style={styles.reportCard}
            onPress={() => openReportDetails(report)}
          >
            <View style={styles.reportHeader}>
              <View style={styles.reportTitleContainer}>
                <ThemedText style={styles.reportTitle}>{report.title}</ThemedText>
                <View style={styles.reportMeta}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(report.priority) + '20' }]}>
                    <ThemedText style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
                      {report.priority.toUpperCase()}
                    </ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20' }]}>
                    <ThemedText style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                      {getStatusDisplayName(report.status)}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <ThemedText style={styles.reportTime}>{getTimeAgo(report.createdAt)}</ThemedText>
            </View>

            <ThemedText style={styles.reportDescription} numberOfLines={2}>
              {report.description}
            </ThemedText>

            <View style={styles.reportDetails}>
              <View style={styles.reportDetail}>
                <SecurityIcon name="location" size={16} color={SecurityColors.text.secondary} />
                <ThemedText style={styles.reportDetailText}>{report.location.address}</ThemedText>
              </View>
              <View style={styles.reportDetail}>
                <SecurityIcon name="person" size={16} color={SecurityColors.text.secondary} />
                <ThemedText style={styles.reportDetailText}>{report.userName}</ThemedText>
              </View>
              {report.assignedTo && (
                <View style={styles.reportDetail}>
                  <SecurityIcon name="checkmark-circle" size={16} color={SecurityColors.status.safe} />
                  <ThemedText style={styles.reportDetailText}>
                    Asignado a: {officerNames[report.assignedTo] || report.assignedTo}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.reportActions}>
              {report.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.assignButton]}
                    onPress={() => {
                      setSelectedReport(report);
                      setSelectedOfficer(null);
                      loadAvailableOfficers();
                      setShowAssignModal(true);
                    }}
                  >
                    <SecurityIcon name="person-add" size={16} color={SecurityColors.status.info} />
                    <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.info }]}>
                      Asignar
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.startButton]}
                    onPress={() => updateReportStatus(report.id, 'in_progress')}
                  >
                    <SecurityIcon name="play" size={16} color={SecurityColors.status.warning} />
                    <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.warning }]}>
                      Iniciar
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}

              {report.status === 'in_progress' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.resolveButton]}
                  onPress={() => updateReportStatus(report.id, 'resolved')}
                >
                  <SecurityIcon name="checkmark" size={16} color={SecurityColors.status.safe} />
                  <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.safe }]}>
                    Resolver
                  </ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => openReportDetails(report)}
              >
                <SecurityIcon name="eye" size={16} color={SecurityColors.text.secondary} />
                <ThemedText style={[styles.actionButtonText, { color: SecurityColors.text.secondary }]}>
                  Ver
                </ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de detalles del reporte */}
      <Modal
        visible={showReportDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Detalles del Reporte</ThemedText>
              <TouchableOpacity onPress={() => setShowReportDetails(false)}>
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
                        {selectedReport.priority.toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedReport.status) + '20' }]}>
                      <ThemedText style={[styles.statusText, { color: getStatusColor(selectedReport.status) }]}>
                        {getStatusDisplayName(selectedReport.status)}
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
                    <ThemedText style={styles.locationText}>{selectedReport.location.address}</ThemedText>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Información del Reportero</ThemedText>
                  <View style={styles.reporterInfo}>
                    <ThemedText style={styles.reporterName}>{selectedReport.userName}</ThemedText>
                    <ThemedText style={styles.reporterEmail}>{selectedReport.userEmail}</ThemedText>
                  </View>
                </View>

                {selectedReport.assignedTo && (
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Asignado a</ThemedText>
                    <ThemedText style={styles.assignedText}>
                      {officerNames[selectedReport.assignedTo] || selectedReport.assignedTo}
                    </ThemedText>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Fechas</ThemedText>
                  <ThemedText style={styles.dateText}>Creado: {formatDate(selectedReport.createdAt)}</ThemedText>
                  <ThemedText style={styles.dateText}>Actualizado: {formatDate(selectedReport.updatedAt)}</ThemedText>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowReportDetails(false)}
              >
                <ThemedText style={styles.closeButtonText}>Cerrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para asignar reporte */}
      <Modal
        visible={showAssignModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Asignar Reporte</ThemedText>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.assignForm}>
              <ThemedText style={styles.fieldLabel}>Seleccionar Oficial:</ThemedText>
              
              {loadingOfficers ? (
                <View style={styles.loadingContainer}>
                  <ThemedText style={styles.loadingText}>Cargando oficiales...</ThemedText>
                </View>
              ) : (
                <ScrollView style={styles.officersList} showsVerticalScrollIndicator={false}>
                  {availableOfficers.map((officer) => (
                    <TouchableOpacity
                      key={officer.id}
                      style={[
                        styles.officerItem,
                        selectedOfficer?.id === officer.id && styles.officerItemSelected
                      ]}
                      onPress={() => setSelectedOfficer(officer)}
                    >
                      <View style={styles.officerInfo}>
                        <ThemedText style={styles.officerName}>
                          {officer.name} {officer.lastName}
                        </ThemedText>
                        <ThemedText style={styles.officerRole}>
                          {getRoleDisplayName(officer.role)}
                        </ThemedText>
                        {officer.department && (
                          <ThemedText style={styles.officerDepartment}>
                            {officer.department}
                          </ThemedText>
                        )}
                      </View>
                      {selectedOfficer?.id === officer.id && (
                        <SecurityIcon name="checkmark-circle" size={20} color={SecurityColors.status.safe} />
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  {availableOfficers.length === 0 && (
                    <View style={styles.noOfficersContainer}>
                      <ThemedText style={styles.noOfficersText}>
                        No hay oficiales disponibles
                      </ThemedText>
                    </View>
                  )}
                </ScrollView>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAssignModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.assignConfirmButton,
                  !selectedOfficer && styles.assignConfirmButtonDisabled
                ]}
                onPress={() => {
                  if (selectedReport && selectedOfficer) {
                    assignReport(selectedReport.id, selectedOfficer.id);
                  }
                }}
                disabled={!selectedOfficer}
              >
                <ThemedText style={[
                  styles.assignConfirmButtonText,
                  !selectedOfficer && styles.assignConfirmButtonTextDisabled
                ]}>
                  {selectedOfficer ? 'Asignar' : 'Selecciona un oficial'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    padding: 20,
    paddingTop: 50,
    backgroundColor: SecurityColors.background.card,
    minHeight: 80,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: SecurityColors.background.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  filterButton: {
    padding: 8,
  },
  filters: {
    padding: 20,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: SecurityColors.text.primary,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SecurityColors.background.card,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: SecurityColors.status.info,
  },
  filterTabText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  filterTabTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reportCard: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitleContainer: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  reportDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  reportDetails: {
    gap: 4,
    marginBottom: 12,
  },
  reportDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportDetailText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  assignButton: {
    backgroundColor: SecurityColors.status.info + '20',
  },
  startButton: {
    backgroundColor: SecurityColors.status.warning + '20',
  },
  resolveButton: {
    backgroundColor: SecurityColors.status.safe + '20',
  },
  viewButton: {
    backgroundColor: SecurityColors.background.light,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
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
  reporterInfo: {
    gap: 4,
  },
  reporterName: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  reporterEmail: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  assignedText: {
    fontSize: 14,
    color: SecurityColors.text.primary,
  },
  dateText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
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
  assignForm: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: SecurityColors.text.primary,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: SecurityColors.text.secondary,
    fontWeight: '600',
  },
  assignConfirmButton: {
    flex: 1,
    backgroundColor: SecurityColors.status.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignConfirmButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  assignConfirmButtonDisabled: {
    backgroundColor: SecurityColors.text.muted,
    opacity: 0.6,
  },
  assignConfirmButtonTextDisabled: {
    color: SecurityColors.text.secondary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: SecurityColors.text.secondary,
    fontSize: 14,
  },
  officersList: {
    maxHeight: 200,
    marginTop: 8,
  },
  officerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
  },
  officerItemSelected: {
    borderColor: SecurityColors.status.info,
    backgroundColor: SecurityColors.status.info + '10',
  },
  officerInfo: {
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 2,
  },
  officerRole: {
    fontSize: 14,
    color: SecurityColors.status.info,
    fontWeight: '500',
    marginBottom: 2,
  },
  officerDepartment: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  noOfficersContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noOfficersText: {
    color: SecurityColors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
});