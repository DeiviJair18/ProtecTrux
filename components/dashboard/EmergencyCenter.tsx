import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Emergency {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  status: string;
  location: string;
  reporterName: string;
  reporterPhone: string;
  assignedTo?: string;
  assignedTeam?: string[];
  createdAt: Date;
  updatedAt: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  estimatedResponseTime?: number;
  actualResponseTime?: number;
  notes?: string;
}

interface EmergencyCenterProps {
  onBack: () => void;
}

export function EmergencyCenter({ onBack }: EmergencyCenterProps) {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showEmergencyDetails, setShowEmergencyDetails] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTo, setAssignTo] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [emergencyNotes, setEmergencyNotes] = useState('');

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      // Simular carga de emergencias
      const mockEmergencies: Emergency[] = [
        {
          id: '1',
          title: 'Emergencia médica crítica',
          description: 'Persona inconsciente en Plaza de Armas. Necesita atención médica inmediata. Se ha llamado a ambulancia.',
          type: 'medical',
          severity: 'critical',
          status: 'active',
          location: 'Plaza de Armas, Centro Histórico',
          reporterName: 'Carlos López',
          reporterPhone: '+51988888888',
          assignedTo: 'Equipo Médico Alpha',
          assignedTeam: ['Dr. Ana Martínez', 'Enf. Pedro Sánchez', 'Paramédico Luis'],
          createdAt: new Date('2024-01-15T14:30:00'),
          updatedAt: new Date('2024-01-15T14:35:00'),
          coordinates: { latitude: -8.1098, longitude: -79.0265 },
          estimatedResponseTime: 5,
          actualResponseTime: 3,
          notes: 'Ambulancia en camino. Equipo de emergencia desplegado.'
        },
        {
          id: '2',
          title: 'Incendio en edificio residencial',
          description: 'Fuego en el tercer piso de edificio en Zona Norte. Múltiples familias evacuadas. Bomberos en camino.',
          type: 'fire',
          severity: 'high',
          status: 'responding',
          location: 'Zona Norte, Av. América Norte 1234',
          reporterName: 'María González',
          reporterPhone: '+51977777777',
          assignedTo: 'Bomberos Estación Central',
          assignedTeam: ['Capitán Juan Pérez', 'Bombero Carlos', 'Rescatista Ana'],
          createdAt: new Date('2024-01-15T13:45:00'),
          updatedAt: new Date('2024-01-15T14:00:00'),
          coordinates: { latitude: -8.1156, longitude: -79.0321 },
          estimatedResponseTime: 8,
          actualResponseTime: 6,
          notes: 'Evacuación en progreso. 2 unidades de bomberos desplegadas.'
        },
        {
          id: '3',
          title: 'Accidente de tránsito múltiple',
          description: 'Colisión entre 3 vehículos en Av. España. Heridos reportados. Tráfico bloqueado.',
          type: 'traffic',
          severity: 'high',
          status: 'resolved',
          location: 'Av. España, intersección con Av. Larco',
          reporterName: 'Luis Ramírez',
          reporterPhone: '+51966666666',
          assignedTo: 'Policía de Tránsito',
          assignedTeam: ['Oficial Pedro', 'Agente María', 'Rescatista Carlos'],
          createdAt: new Date('2024-01-15T12:20:00'),
          updatedAt: new Date('2024-01-15T13:30:00'),
          coordinates: { latitude: -8.1089, longitude: -79.0254 },
          estimatedResponseTime: 10,
          actualResponseTime: 8,
          notes: 'Accidente resuelto. Heridos trasladados al hospital. Tráfico restaurado.'
        },
        {
          id: '4',
          title: 'Amenaza de bomba en centro comercial',
          description: 'Llamada anónima reportando amenaza de bomba en Mall Aventura. Evacuación en curso.',
          type: 'security',
          severity: 'critical',
          status: 'active',
          location: 'Mall Aventura Plaza',
          reporterName: 'Sofia Torres',
          reporterPhone: '+51955555555',
          assignedTo: 'Policía Nacional',
          assignedTeam: ['Capitán Roberto', 'Oficial Ana', 'Especialista en Explosivos'],
          createdAt: new Date('2024-01-15T15:10:00'),
          updatedAt: new Date('2024-01-15T15:15:00'),
          coordinates: { latitude: -8.1200, longitude: -79.0300 },
          estimatedResponseTime: 15,
          notes: 'Evacuación completa. Equipo de desactivación en camino.'
        }
      ];
      setEmergencies(mockEmergencies);
    } catch (error) {
      console.error('Error cargando emergencias:', error);
      Alert.alert('Error', 'No se pudieron cargar las emergencias');
    } finally {
      setLoading(false);
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'medical':
        return 'Médica';
      case 'fire':
        return 'Incendio';
      case 'traffic':
        return 'Tránsito';
      case 'security':
        return 'Seguridad';
      case 'natural':
        return 'Natural';
      default:
        return 'General';
    }
  };

  const getSeverityDisplayName = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Crítica';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Desconocida';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'responding':
        return 'Respondiendo';
      case 'resolved':
        return 'Resuelta';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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
      case 'active':
        return SecurityColors.status.danger;
      case 'responding':
        return SecurityColors.status.warning;
      case 'resolved':
        return SecurityColors.status.safe;
      case 'cancelled':
        return SecurityColors.text.secondary;
      default:
        return SecurityColors.text.secondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return 'medical';
      case 'fire':
        return 'flame';
      case 'traffic':
        return 'car';
      case 'security':
        return 'shield';
      case 'natural':
        return 'cloudy';
      default:
        return 'warning';
    }
  };

  const filteredEmergencies = emergencies.filter(emergency => {
    const matchesStatus = filterStatus === 'all' || emergency.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || emergency.severity === filterSeverity;
    return matchesStatus && matchesSeverity;
  });

  const updateEmergencyStatus = async (emergencyId: string, newStatus: string) => {
    try {
      setEmergencies(emergencies.map(emergency => 
        emergency.id === emergencyId 
          ? { ...emergency, status: newStatus, updatedAt: new Date() }
          : emergency
      ));
      Alert.alert('Éxito', 'Estado de la emergencia actualizado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la emergencia');
    }
  };

  const assignEmergency = async (emergencyId: string, assignedTo: string) => {
    try {
      setEmergencies(emergencies.map(emergency => 
        emergency.id === emergencyId 
          ? { ...emergency, assignedTo, updatedAt: new Date() }
          : emergency
      ));
      Alert.alert('Éxito', 'Emergencia asignada correctamente');
      setShowAssignModal(false);
      setAssignTo('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo asignar la emergencia');
    }
  };

  const addEmergencyNotes = async (emergencyId: string, notes: string) => {
    try {
      setEmergencies(emergencies.map(emergency => 
        emergency.id === emergencyId 
          ? { ...emergency, notes, updatedAt: new Date() }
          : emergency
      ));
      Alert.alert('Éxito', 'Notas agregadas correctamente');
      setShowNotesModal(false);
      setEmergencyNotes('');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron agregar las notas');
    }
  };

  const openEmergencyDetails = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setShowEmergencyDetails(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
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

  const activeEmergencies = emergencies.filter(e => e.status === 'active').length;
  const respondingEmergencies = emergencies.filter(e => e.status === 'responding').length;
  const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Centro de Emergencias</ThemedText>
        <TouchableOpacity style={styles.alertButton}>
          <SecurityIcon name="alert-circle" size={24} color={SecurityColors.status.danger} />
        </TouchableOpacity>
      </View>

      {/* Estadísticas críticas */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: SecurityColors.status.danger + '20' }]}>
          <ThemedText style={[styles.statNumber, { color: SecurityColors.status.danger }]}>
            {activeEmergencies}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Activas</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: SecurityColors.status.warning + '20' }]}>
          <ThemedText style={[styles.statNumber, { color: SecurityColors.status.warning }]}>
            {respondingEmergencies}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Respondiendo</ThemedText>
        </View>
        <View style={[styles.statCard, { backgroundColor: SecurityColors.status.safe + '20' }]}>
          <ThemedText style={[styles.statNumber, { color: SecurityColors.status.safe }]}>
            {resolvedEmergencies}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Resueltas</ThemedText>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {[
            { key: 'all', label: 'Todas' },
            { key: 'active', label: 'Activas' },
            { key: 'responding', label: 'Respondiendo' },
            { key: 'resolved', label: 'Resueltas' }
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {[
            { key: 'all', label: 'Todas las severidades' },
            { key: 'critical', label: 'Crítica' },
            { key: 'high', label: 'Alta' },
            { key: 'medium', label: 'Media' },
            { key: 'low', label: 'Baja' }
          ].map(severity => (
            <TouchableOpacity
              key={severity.key}
              style={[
                styles.filterTab,
                filterSeverity === severity.key && styles.filterTabActive
              ]}
              onPress={() => setFilterSeverity(severity.key)}
            >
              <ThemedText style={[
                styles.filterTabText,
                filterSeverity === severity.key && styles.filterTabTextActive
              ]}>
                {severity.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de emergencias */}
      <ScrollView style={styles.emergenciesList} showsVerticalScrollIndicator={false}>
        {filteredEmergencies.map(emergency => (
          <TouchableOpacity 
            key={emergency.id} 
            style={[
              styles.emergencyCard,
              emergency.severity === 'critical' && styles.criticalEmergency
            ]}
            onPress={() => openEmergencyDetails(emergency)}
          >
            <View style={styles.emergencyHeader}>
              <View style={styles.emergencyIcon}>
                <SecurityIcon 
                  name={getTypeIcon(emergency.type)} 
                  size={24} 
                  color={getSeverityColor(emergency.severity)} 
                />
              </View>
              <View style={styles.emergencyContent}>
                <View style={styles.emergencyTitleRow}>
                  <ThemedText style={styles.emergencyTitle}>{emergency.title}</ThemedText>
                  <View style={styles.emergencyBadges}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(emergency.severity) + '20' }]}>
                      <ThemedText style={[styles.severityText, { color: getSeverityColor(emergency.severity) }]}>
                        {getSeverityDisplayName(emergency.severity)}
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(emergency.status) + '20' }]}>
                      <ThemedText style={[styles.statusText, { color: getStatusColor(emergency.status) }]}>
                        {getStatusDisplayName(emergency.status)}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                <ThemedText style={styles.emergencyDescription} numberOfLines={2}>
                  {emergency.description}
                </ThemedText>
                <View style={styles.emergencyMeta}>
                  <View style={styles.emergencyDetail}>
                    <SecurityIcon name="location" size={16} color={SecurityColors.text.secondary} />
                    <ThemedText style={styles.emergencyDetailText}>{emergency.location}</ThemedText>
                  </View>
                  <View style={styles.emergencyDetail}>
                    <SecurityIcon name="person" size={16} color={SecurityColors.text.secondary} />
                    <ThemedText style={styles.emergencyDetailText}>{emergency.reporterName}</ThemedText>
                  </View>
                  <ThemedText style={styles.emergencyTime}>{getTimeAgo(emergency.createdAt)}</ThemedText>
                </View>
                {emergency.assignedTo && (
                  <View style={styles.assignedInfo}>
                    <SecurityIcon name="checkmark-circle" size={16} color={SecurityColors.status.safe} />
                    <ThemedText style={styles.assignedText}>Asignado a: {emergency.assignedTo}</ThemedText>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.emergencyActions}>
              {emergency.status === 'active' && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.assignButton]}
                    onPress={() => {
                      setSelectedEmergency(emergency);
                      setShowAssignModal(true);
                    }}
                  >
                    <SecurityIcon name="person-add" size={16} color={SecurityColors.status.info} />
                    <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.info }]}>
                      Asignar
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.respondButton]}
                    onPress={() => updateEmergencyStatus(emergency.id, 'responding')}
                  >
                    <SecurityIcon name="play" size={16} color={SecurityColors.status.warning} />
                    <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.warning }]}>
                      Responder
                    </ThemedText>
                  </TouchableOpacity>
                </>
              )}

              {emergency.status === 'responding' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.resolveButton]}
                  onPress={() => updateEmergencyStatus(emergency.id, 'resolved')}
                >
                  <SecurityIcon name="checkmark" size={16} color={SecurityColors.status.safe} />
                  <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.safe }]}>
                    Resolver
                  </ThemedText>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.notesButton]}
                onPress={() => {
                  setSelectedEmergency(emergency);
                  setEmergencyNotes(emergency.notes || '');
                  setShowNotesModal(true);
                }}
              >
                <SecurityIcon name="document-text" size={16} color={SecurityColors.text.secondary} />
                <ThemedText style={[styles.actionButtonText, { color: SecurityColors.text.secondary }]}>
                  Notas
                </ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de detalles de emergencia */}
      <Modal
        visible={showEmergencyDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEmergencyDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Detalles de Emergencia</ThemedText>
              <TouchableOpacity onPress={() => setShowEmergencyDetails(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedEmergency && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <ThemedText style={styles.detailTitle}>{selectedEmergency.title}</ThemedText>
                  <View style={styles.detailMeta}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(selectedEmergency.severity) + '20' }]}>
                      <ThemedText style={[styles.severityText, { color: getSeverityColor(selectedEmergency.severity) }]}>
                        {getSeverityDisplayName(selectedEmergency.severity)}
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedEmergency.status) + '20' }]}>
                      <ThemedText style={[styles.statusText, { color: getStatusColor(selectedEmergency.status) }]}>
                        {getStatusDisplayName(selectedEmergency.status)}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Descripción</ThemedText>
                  <ThemedText style={styles.detailText}>{selectedEmergency.description}</ThemedText>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Ubicación</ThemedText>
                  <View style={styles.locationContainer}>
                    <SecurityIcon name="location" size={20} color={SecurityColors.status.info} />
                    <ThemedText style={styles.locationText}>{selectedEmergency.location}</ThemedText>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Información del Reportero</ThemedText>
                  <View style={styles.reporterInfo}>
                    <ThemedText style={styles.reporterName}>{selectedEmergency.reporterName}</ThemedText>
                    <ThemedText style={styles.reporterPhone}>{selectedEmergency.reporterPhone}</ThemedText>
                  </View>
                </View>

                {selectedEmergency.assignedTo && (
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Equipo Asignado</ThemedText>
                    <ThemedText style={styles.assignedText}>{selectedEmergency.assignedTo}</ThemedText>
                    {selectedEmergency.assignedTeam && (
                      <View style={styles.teamList}>
                        {selectedEmergency.assignedTeam.map((member, index) => (
                          <ThemedText key={index} style={styles.teamMember}>• {member}</ThemedText>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {selectedEmergency.estimatedResponseTime && (
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Tiempo de Respuesta</ThemedText>
                    <ThemedText style={styles.responseTimeText}>
                      Estimado: {selectedEmergency.estimatedResponseTime} minutos
                    </ThemedText>
                    {selectedEmergency.actualResponseTime && (
                      <ThemedText style={styles.responseTimeText}>
                        Real: {selectedEmergency.actualResponseTime} minutos
                      </ThemedText>
                    )}
                  </View>
                )}

                {selectedEmergency.notes && (
                  <View style={styles.detailSection}>
                    <ThemedText style={styles.sectionTitle}>Notas</ThemedText>
                    <ThemedText style={styles.detailText}>{selectedEmergency.notes}</ThemedText>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <ThemedText style={styles.sectionTitle}>Fechas</ThemedText>
                  <ThemedText style={styles.dateText}>Creado: {formatDate(selectedEmergency.createdAt)}</ThemedText>
                  <ThemedText style={styles.dateText}>Actualizado: {formatDate(selectedEmergency.updatedAt)}</ThemedText>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowEmergencyDetails(false)}
              >
                <ThemedText style={styles.closeButtonText}>Cerrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para asignar emergencia */}
      <Modal
        visible={showAssignModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Asignar Emergencia</ThemedText>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.assignForm}>
              <ThemedText style={styles.fieldLabel}>Asignar a:</ThemedText>
              <TextInput
                style={styles.textInput}
                value={assignTo}
                onChangeText={setAssignTo}
                placeholder="Nombre del equipo o responsable"
                placeholderTextColor={SecurityColors.text.secondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAssignModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.assignConfirmButton}
                onPress={() => {
                  if (selectedEmergency && assignTo.trim()) {
                    assignEmergency(selectedEmergency.id, assignTo.trim());
                  }
                }}
              >
                <ThemedText style={styles.assignConfirmButtonText}>Asignar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para notas */}
      <Modal
        visible={showNotesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Notas de Emergencia</ThemedText>
              <TouchableOpacity onPress={() => setShowNotesModal(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.notesForm}>
              <ThemedText style={styles.fieldLabel}>Notas:</ThemedText>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={emergencyNotes}
                onChangeText={setEmergencyNotes}
                placeholder="Agregar notas sobre la emergencia..."
                placeholderTextColor={SecurityColors.text.secondary}
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowNotesModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => {
                  if (selectedEmergency) {
                    addEmergencyNotes(selectedEmergency.id, emergencyNotes);
                  }
                }}
              >
                <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  alertButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  filters: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
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
  emergenciesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emergencyCard: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  criticalEmergency: {
    borderLeftWidth: 4,
    borderLeftColor: SecurityColors.status.danger,
  },
  emergencyHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    flex: 1,
  },
  emergencyBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
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
  emergencyDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  emergencyMeta: {
    gap: 4,
    marginBottom: 8,
  },
  emergencyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyDetailText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  emergencyTime: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  assignedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assignedText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  emergencyActions: {
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
  respondButton: {
    backgroundColor: SecurityColors.status.warning + '20',
  },
  resolveButton: {
    backgroundColor: SecurityColors.status.safe + '20',
  },
  notesButton: {
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
  reporterPhone: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  teamList: {
    gap: 4,
  },
  teamMember: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  responseTimeText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  notesForm: {
    marginBottom: 20,
  },
  saveButton: {
    flex: 1,
    backgroundColor: SecurityColors.status.safe,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
});