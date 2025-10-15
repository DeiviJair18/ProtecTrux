import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: Date;
  actionRequired?: boolean;
  actionUrl?: string;
  sender?: string;
  category: string;
}

interface NotificationsCenterProps {
  onBack: () => void;
}

export function NotificationsCenter({ onBack }: NotificationsCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    category: 'system'
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Simular carga de notificaciones
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Nuevo reporte de emergencia',
          message: 'Se ha recibido un reporte de emergencia médica en Plaza de Armas. Se requiere atención inmediata.',
          type: 'emergency',
          priority: 'critical',
          isRead: false,
          createdAt: new Date('2024-01-15T14:30:00'),
          actionRequired: true,
          actionUrl: '/reports/2',
          sender: 'Sistema',
          category: 'reports'
        },
        {
          id: '2',
          title: 'Usuario registrado',
          message: 'Nuevo usuario registrado: María González (maria@email.com)',
          type: 'user',
          priority: 'low',
          isRead: true,
          createdAt: new Date('2024-01-15T13:45:00'),
          sender: 'Sistema',
          category: 'users'
        },
        {
          id: '3',
          title: 'Reporte resuelto',
          message: 'El reporte de vandalismo en Parque Central ha sido resuelto por Pedro Sánchez.',
          type: 'success',
          priority: 'medium',
          isRead: false,
          createdAt: new Date('2024-01-15T12:20:00'),
          sender: 'Pedro Sánchez',
          category: 'reports'
        },
        {
          id: '4',
          title: 'Mantenimiento programado',
          message: 'El sistema estará en mantenimiento el domingo 21 de enero de 2:00 AM a 4:00 AM.',
          type: 'maintenance',
          priority: 'medium',
          isRead: true,
          createdAt: new Date('2024-01-15T10:00:00'),
          sender: 'Administrador',
          category: 'system'
        },
        {
          id: '5',
          title: 'Alerta de seguridad',
          message: 'Se ha detectado actividad sospechosa en el sistema. Se recomienda revisar los logs de acceso.',
          type: 'security',
          priority: 'high',
          isRead: false,
          createdAt: new Date('2024-01-15T09:15:00'),
          sender: 'Sistema de Seguridad',
          category: 'security'
        },
        {
          id: '6',
          title: 'Backup completado',
          message: 'El backup diario de la base de datos se ha completado exitosamente.',
          type: 'info',
          priority: 'low',
          isRead: true,
          createdAt: new Date('2024-01-15T06:00:00'),
          sender: 'Sistema',
          category: 'system'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
      Alert.alert('Error', 'No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'Emergencia';
      case 'user':
        return 'Usuario';
      case 'success':
        return 'Éxito';
      case 'maintenance':
        return 'Mantenimiento';
      case 'security':
        return 'Seguridad';
      case 'info':
        return 'Información';
      default:
        return 'General';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return SecurityColors.status.danger;
      case 'user':
        return SecurityColors.status.info;
      case 'success':
        return SecurityColors.status.safe;
      case 'maintenance':
        return SecurityColors.status.warning;
      case 'security':
        return SecurityColors.status.danger;
      case 'info':
        return SecurityColors.text.secondary;
      default:
        return SecurityColors.text.secondary;
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'warning';
      case 'user':
        return 'person';
      case 'success':
        return 'checkmark-circle';
      case 'maintenance':
        return 'settings';
      case 'security':
        return 'shield';
      case 'info':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar la notificación como leída');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notification => 
        ({ ...notification, isRead: true })
      ));
      Alert.alert('Éxito', 'Todas las notificaciones han sido marcadas como leídas');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron marcar las notificaciones como leídas');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
            Alert.alert('Éxito', 'Notificación eliminada');
          }
        }
      ]
    );
  };

  const createNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const notification: Notification = {
        id: Date.now().toString(),
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        priority: newNotification.priority,
        isRead: false,
        createdAt: new Date(),
        sender: 'Administrador',
        category: newNotification.category
      };

      setNotifications([notification, ...notifications]);
      Alert.alert('Éxito', 'Notificación creada correctamente');
      
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        category: 'system'
      });
      setShowCreateNotification(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la notificación');
    }
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Centro de Notificaciones</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={markAllAsRead}
            style={styles.headerButton}
          >
            <SecurityIcon name="checkmark-done" size={20} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowCreateNotification(true)}
            style={styles.headerButton}
          >
            <SecurityIcon name="add" size={20} color={SecurityColors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={styles.statNumber}>{notifications.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Total</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: SecurityColors.status.danger }]}>{unreadCount}</ThemedText>
          <ThemedText style={styles.statLabel}>No leídas</ThemedText>
        </View>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statNumber, { color: SecurityColors.status.safe }]}>{notifications.length - unreadCount}</ThemedText>
          <ThemedText style={styles.statLabel}>Leídas</ThemedText>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {[
            { key: 'all', label: 'Todas' },
            { key: 'emergency', label: 'Emergencias' },
            { key: 'user', label: 'Usuarios' },
            { key: 'success', label: 'Éxito' },
            { key: 'security', label: 'Seguridad' },
            { key: 'info', label: 'Info' }
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {[
            { key: 'all', label: 'Todas las prioridades' },
            { key: 'critical', label: 'Crítica' },
            { key: 'high', label: 'Alta' },
            { key: 'medium', label: 'Media' },
            { key: 'low', label: 'Baja' }
          ].map(priority => (
            <TouchableOpacity
              key={priority.key}
              style={[
                styles.filterTab,
                filterPriority === priority.key && styles.filterTabActive
              ]}
              onPress={() => setFilterPriority(priority.key)}
            >
              <ThemedText style={[
                styles.filterTabText,
                filterPriority === priority.key && styles.filterTabTextActive
              ]}>
                {priority.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de notificaciones */}
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {filteredNotifications.map(notification => (
          <View key={notification.id} style={[
            styles.notificationCard,
            !notification.isRead && styles.unreadNotification
          ]}>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationIcon}>
                <SecurityIcon 
                  name={getTypeIcon(notification.type)} 
                  size={20} 
                  color={getTypeColor(notification.type)} 
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationTitleRow}>
                  <ThemedText style={[
                    styles.notificationTitle,
                    !notification.isRead && styles.unreadTitle
                  ]}>
                    {notification.title}
                  </ThemedText>
                  {!notification.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
                <ThemedText style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </ThemedText>
                <View style={styles.notificationMeta}>
                  <View style={[styles.typeBadge, { backgroundColor: getTypeColor(notification.type) + '20' }]}>
                    <ThemedText style={[styles.typeText, { color: getTypeColor(notification.type) }]}>
                      {getTypeDisplayName(notification.type)}
                    </ThemedText>
                  </View>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(notification.priority) + '20' }]}>
                    <ThemedText style={[styles.priorityText, { color: getPriorityColor(notification.priority) }]}>
                      {notification.priority.toUpperCase()}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.notificationTime}>
                    {getTimeAgo(notification.createdAt)}
                  </ThemedText>
                </View>
                {notification.sender && (
                  <ThemedText style={styles.notificationSender}>
                    Por: {notification.sender}
                  </ThemedText>
                )}
              </View>
            </View>

            <View style={styles.notificationActions}>
              {!notification.isRead && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.markReadButton]}
                  onPress={() => markAsRead(notification.id)}
                >
                  <SecurityIcon name="checkmark" size={16} color={SecurityColors.status.safe} />
                  <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.safe }]}>
                    Marcar como leída
                  </ThemedText>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => deleteNotification(notification.id)}
              >
                <SecurityIcon name="trash" size={16} color={SecurityColors.status.danger} />
                <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.danger }]}>
                  Eliminar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para crear notificación */}
      <Modal
        visible={showCreateNotification}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateNotification(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Crear Notificación</ThemedText>
              <TouchableOpacity onPress={() => setShowCreateNotification(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Título *</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={newNotification.title}
                  onChangeText={(text) => setNewNotification({...newNotification, title: text})}
                  placeholder="Título de la notificación"
                  placeholderTextColor={SecurityColors.text.secondary}
                />
              </View>

              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Mensaje *</ThemedText>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newNotification.message}
                  onChangeText={(text) => setNewNotification({...newNotification, message: text})}
                  placeholder="Descripción de la notificación"
                  placeholderTextColor={SecurityColors.text.secondary}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <ThemedText style={styles.fieldLabel}>Tipo</ThemedText>
                  <View style={styles.pickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {[
                        { value: 'info', label: 'Info' },
                        { value: 'emergency', label: 'Emergencia' },
                        { value: 'security', label: 'Seguridad' },
                        { value: 'maintenance', label: 'Mantenimiento' }
                      ].map(type => (
                        <TouchableOpacity
                          key={type.value}
                          style={[
                            styles.optionButton,
                            newNotification.type === type.value && styles.optionButtonActive
                          ]}
                          onPress={() => setNewNotification({...newNotification, type: type.value})}
                        >
                          <ThemedText style={[
                            styles.optionButtonText,
                            newNotification.type === type.value && styles.optionButtonTextActive
                          ]}>
                            {type.label}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>

                <View style={styles.formField}>
                  <ThemedText style={styles.fieldLabel}>Prioridad</ThemedText>
                  <View style={styles.pickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {[
                        { value: 'low', label: 'Baja' },
                        { value: 'medium', label: 'Media' },
                        { value: 'high', label: 'Alta' },
                        { value: 'critical', label: 'Crítica' }
                      ].map(priority => (
                        <TouchableOpacity
                          key={priority.value}
                          style={[
                            styles.optionButton,
                            newNotification.priority === priority.value && styles.optionButtonActive
                          ]}
                          onPress={() => setNewNotification({...newNotification, priority: priority.value})}
                        >
                          <ThemedText style={[
                            styles.optionButtonText,
                            newNotification.priority === priority.value && styles.optionButtonTextActive
                          ]}>
                            {priority.label}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreateNotification(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.createButton}
                onPress={createNotification}
              >
                <ThemedText style={styles.createButtonText}>Crear</ThemedText>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
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
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: SecurityColors.status.info,
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SecurityColors.status.info,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
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
  notificationTime: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  notificationSender: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  notificationActions: {
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
  markReadButton: {
    backgroundColor: SecurityColors.status.safe + '20',
  },
  deleteButton: {
    backgroundColor: SecurityColors.status.danger + '20',
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
  modalForm: {
    maxHeight: 400,
  },
  formField: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
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
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginTop: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 20,
    marginRight: 8,
  },
  optionButtonActive: {
    backgroundColor: SecurityColors.status.info,
  },
  optionButtonText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  optionButtonTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  createButton: {
    flex: 1,
    backgroundColor: SecurityColors.status.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
});