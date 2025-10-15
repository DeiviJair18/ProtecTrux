import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CitizenEmergencyCenterProps {
  onBack: () => void;
}

export function CitizenEmergencyCenter({ onBack }: CitizenEmergencyCenterProps) {
  const [emergencyType, setEmergencyType] = useState<string | null>(null);

  const emergencyContacts = [
    {
      id: 'police',
      name: 'Policía Nacional',
      number: '105',
      description: 'Emergencias de seguridad y delitos',
      color: SecurityColors.danger,
      icon: 'shield',
      isEmergency: true
    },
    {
      id: 'serenazgo',
      name: 'Serenazgo',
      number: '044-485000',
      description: 'Seguridad ciudadana municipal',
      color: SecurityColors.primary,
      icon: 'car',
      isEmergency: false
    },
    {
      id: 'firefighters',
      name: 'Bomberos',
      number: '116',
      description: 'Emergencias de incendios y rescates',
      color: SecurityColors.warning,
      icon: 'flame',
      isEmergency: true
    },
    {
      id: 'medical',
      name: 'Emergencias Médicas',
      number: '117',
      description: 'Ambulancias y emergencias médicas',
      color: SecurityColors.success,
      icon: 'medical',
      isEmergency: true
    }
  ];

  const quickActions = [
    {
      id: 'panic',
      title: 'Botón de Pánico',
      description: 'Activar alerta de emergencia inmediata',
      color: SecurityColors.danger,
      icon: 'warning',
      action: () => handlePanicButton()
    },
    {
      id: 'location',
      title: 'Enviar Ubicación',
      description: 'Compartir mi ubicación con emergencias',
      color: SecurityColors.info,
      icon: 'location',
      action: () => handleSendLocation()
    },
    {
      id: 'report',
      title: 'Reporte de Emergencia',
      description: 'Crear reporte de emergencia urgente',
      color: SecurityColors.warning,
      icon: 'add-circle',
      action: () => handleEmergencyReport()
    }
  ];

  const emergencyTypes = [
    {
      id: 'theft',
      title: 'Robo en Progreso',
      description: 'Alguien está siendo robado',
      color: SecurityColors.danger,
      icon: 'shield'
    },
    {
      id: 'violence',
      title: 'Violencia',
      description: 'Acto de violencia en curso',
      color: SecurityColors.danger,
      icon: 'warning'
    },
    {
      id: 'accident',
      title: 'Accidente',
      description: 'Accidente de tránsito o personal',
      color: SecurityColors.warning,
      icon: 'car'
    },
    {
      id: 'fire',
      title: 'Incendio',
      description: 'Fuego o emergencia de incendio',
      color: SecurityColors.warning,
      icon: 'flame'
    },
    {
      id: 'medical',
      title: 'Emergencia Médica',
      description: 'Persona herida o enferma',
      color: SecurityColors.success,
      icon: 'medical'
    },
    {
      id: 'other',
      title: 'Otra Emergencia',
      description: 'Otro tipo de emergencia',
      color: SecurityColors.text.secondary,
      icon: 'help'
    }
  ];

  const handleCall = (contact: any) => {
    Alert.alert(
      `Llamar a ${contact.name}`,
      `¿Deseas llamar al ${contact.number}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar', 
          onPress: () => {
            Linking.openURL(`tel:${contact.number}`);
          }
        }
      ]
    );
  };

  const handlePanicButton = () => {
    Alert.alert(
      'Botón de Pánico',
      '¿Estás en peligro inmediato? Esta acción enviará una alerta de emergencia a todas las autoridades.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'ACTIVAR ALERTA', 
          style: 'destructive',
          onPress: () => {
            // Aquí se implementaría la lógica de alerta de pánico
            Alert.alert('Alerta Activada', 'Se ha enviado una alerta de emergencia a las autoridades.');
          }
        }
      ]
    );
  };

  const handleSendLocation = () => {
    Alert.alert(
      'Enviar Ubicación',
      'Se enviará tu ubicación actual a los servicios de emergencia.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Enviar', 
          onPress: () => {
            // Aquí se implementaría la lógica de envío de ubicación
            Alert.alert('Ubicación Enviada', 'Tu ubicación ha sido compartida con los servicios de emergencia.');
          }
        }
      ]
    );
  };

  const handleEmergencyReport = () => {
    Alert.alert(
      'Reporte de Emergencia',
      'Se abrirá el formulario para crear un reporte de emergencia urgente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Crear Reporte', 
          onPress: () => {
            // Aquí se navegaría al formulario de reporte de emergencia
            console.log('Navegar a formulario de emergencia');
          }
        }
      ]
    );
  };

  const handleEmergencyType = (type: any) => {
    setEmergencyType(type.id);
    Alert.alert(
      `Emergencia: ${type.title}`,
      `Has seleccionado "${type.title}". ¿Qué deseas hacer?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar Policía (105)', 
          onPress: () => handleCall(emergencyContacts[0])
        },
        { 
          text: 'Llamar Bomberos (116)', 
          onPress: () => handleCall(emergencyContacts[2])
        },
        { 
          text: 'Llamar Médicos (117)', 
          onPress: () => handleCall(emergencyContacts[3])
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Centro de Emergencias</ThemedText>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <SecurityIcon name="settings" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Alert */}
        <View style={styles.emergencyAlert}>
          <View style={styles.emergencyAlertHeader}>
            <SecurityIcon name="warning" size={24} color={SecurityColors.danger} />
            <ThemedText style={styles.emergencyAlertTitle}>¿EMERGENCIA?</ThemedText>
          </View>
          <ThemedText style={styles.emergencyAlertText}>
            Si estás en peligro inmediato, usa el botón de pánico o llama directamente a los números de emergencia.
          </ThemedText>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { borderLeftColor: action.color }]}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                  <SecurityIcon name={action.icon} size={24} color={action.color} />
                </View>
                <View style={styles.quickActionContent}>
                  <ThemedText style={styles.quickActionTitle}>{action.title}</ThemedText>
                  <ThemedText style={styles.quickActionDescription}>{action.description}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Types */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tipo de Emergencia</ThemedText>
          <View style={styles.emergencyTypesGrid}>
            {emergencyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.emergencyTypeCard,
                  { borderLeftColor: type.color },
                  emergencyType === type.id && styles.emergencyTypeCardSelected
                ]}
                onPress={() => handleEmergencyType(type)}
              >
                <View style={[styles.emergencyTypeIcon, { backgroundColor: type.color + '20' }]}>
                  <SecurityIcon name={type.icon} size={20} color={type.color} />
                </View>
                <View style={styles.emergencyTypeContent}>
                  <ThemedText style={styles.emergencyTypeTitle}>{type.title}</ThemedText>
                  <ThemedText style={styles.emergencyTypeDescription}>{type.description}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contactos de Emergencia</ThemedText>
          <View style={styles.contactsList}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[styles.contactCard, { borderLeftColor: contact.color }]}
                onPress={() => handleCall(contact)}
              >
                <View style={styles.contactHeader}>
                  <View style={[styles.contactIcon, { backgroundColor: contact.color + '20' }]}>
                    <SecurityIcon name={contact.icon} size={24} color={contact.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                    <ThemedText style={styles.contactNumber}>{contact.number}</ThemedText>
                    <ThemedText style={styles.contactDescription}>{contact.description}</ThemedText>
                  </View>
                  <View style={styles.contactActions}>
                    {contact.isEmergency && (
                      <View style={styles.emergencyBadge}>
                        <ThemedText style={styles.emergencyBadgeText}>URGENTE</ThemedText>
                      </View>
                    )}
                    <SecurityIcon name="call" size={20} color={contact.color} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Consejos de Seguridad</ThemedText>
          <View style={styles.tipsList}>
            <View style={styles.tipCard}>
              <SecurityIcon name="shield" size={20} color={SecurityColors.primary} />
              <ThemedText style={styles.tipText}>
                Mantén la calma y evalúa la situación antes de actuar
              </ThemedText>
            </View>
            <View style={styles.tipCard}>
              <SecurityIcon name="location" size={20} color={SecurityColors.info} />
              <ThemedText style={styles.tipText}>
                Proporciona tu ubicación exacta a los servicios de emergencia
              </ThemedText>
            </View>
            <View style={styles.tipCard}>
              <SecurityIcon name="time" size={20} color={SecurityColors.warning} />
              <ThemedText style={styles.tipText}>
                Actúa rápidamente pero de manera segura
              </ThemedText>
            </View>
            <View style={styles.tipCard}>
              <SecurityIcon name="people" size={20} color={SecurityColors.success} />
              <ThemedText style={styles.tipText}>
                Busca ayuda de otras personas si es seguro hacerlo
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
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
  emergencyAlert: {
    backgroundColor: SecurityColors.danger + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: SecurityColors.danger + '30',
  },
  emergencyAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyAlertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.danger,
    marginLeft: 8,
  },
  emergencyAlertText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  emergencyTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emergencyTypeCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
  },
  emergencyTypeCardSelected: {
    backgroundColor: SecurityColors.primary + '10',
  },
  emergencyTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyTypeContent: {
    flex: 1,
  },
  emergencyTypeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 2,
  },
  emergencyTypeDescription: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  contactsList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.primary,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  contactActions: {
    alignItems: 'center',
    gap: 8,
  },
  emergencyBadge: {
    backgroundColor: SecurityColors.danger,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  emergencyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SecurityColors.background.light,
  },
  tipsList: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});







