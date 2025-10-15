import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CitizenDashboardProps {
  onNavigate: (screen: string) => void;
}

export function CitizenDashboard({ onNavigate }: CitizenDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const navigationItems = [
    {
      id: 'reports',
      title: 'Crear Reporte',
      icon: 'add-circle',
      color: SecurityColors.primary,
      description: 'Reportar incidentes de seguridad'
    },
    {
      id: 'my-reports',
      title: 'Mis Reportes',
      icon: 'list',
      color: SecurityColors.info,
      description: 'Ver mis reportes enviados'
    },
    {
      id: 'emergency',
      title: 'Emergencias',
      icon: 'warning',
      color: SecurityColors.danger,
      description: 'Contacto de emergencia'
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      icon: 'person',
      color: SecurityColors.success,
      description: 'Configurar mi cuenta'
    }
  ];

  const quickActions = [
    {
      title: 'Botón de Pánico',
      icon: 'warning',
      color: SecurityColors.danger,
      action: () => onNavigate('panic-button')
    },
    {
      title: 'Reporte Rápido',
      icon: 'flash',
      color: SecurityColors.warning,
      action: () => onNavigate('quick-report')
    },
    {
      title: 'Llamar Policía',
      icon: 'call',
      color: SecurityColors.status.danger,
      action: () => onNavigate('police-call')
    },
    {
      title: 'Ubicación Actual',
      icon: 'location',
      color: SecurityColors.info,
      action: () => console.log('Obtener ubicación')
    }
  ];

  const stats = [
    { label: 'Reportes Enviados', value: '12', color: SecurityColors.primary },
    { label: 'En Proceso', value: '3', color: SecurityColors.warning },
    { label: 'Resueltos', value: '9', color: SecurityColors.success },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <SecurityIcon name="menu" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <ThemedText style={styles.headerTitleText}>SecureTrux</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Ciudadano</ThemedText>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <SecurityIcon name="notifications" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Sidebar */}
        {sidebarOpen && (
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <ThemedText style={styles.sidebarTitle}>Menú</ThemedText>
              <TouchableOpacity
                onPress={() => setSidebarOpen(false)}
                style={styles.closeButton}
              >
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sidebarContent}>
              {navigationItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.sidebarItem}
                  onPress={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                >
                  <View style={[styles.sidebarIcon, { backgroundColor: item.color + '20' }]}>
                    <SecurityIcon name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={styles.sidebarItemText}>
                    <ThemedText style={styles.sidebarItemTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.sidebarItemDescription}>{item.description}</ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Main Content */}
        <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <ThemedText style={styles.welcomeTitle}>¡Bienvenido!</ThemedText>
            <ThemedText style={styles.welcomeSubtitle}>
              Tu seguridad es nuestra prioridad
            </ThemedText>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Acciones Rápidas</ThemedText>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.quickActionCard, { borderLeftColor: action.color }]}
                  onPress={action.action}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                    <SecurityIcon name={action.icon} size={24} color={action.color} />
                  </View>
                  <ThemedText style={styles.quickActionTitle}>{action.title}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Mis Estadísticas</ThemedText>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <SecurityIcon name="trending-up" size={20} color={stat.color} />
                  </View>
                  <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                  <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Navigation Cards */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Servicios</ThemedText>
            <View style={styles.navigationGrid}>
              {navigationItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navigationCard, { borderLeftColor: item.color }]}
                  onPress={() => onNavigate(item.id)}
                >
                  <View style={styles.navigationCardContent}>
                    <View style={[styles.navigationIcon, { backgroundColor: item.color + '20' }]}>
                      <SecurityIcon name={item.icon} size={24} color={item.color} />
                    </View>
                    <View style={styles.navigationText}>
                      <ThemedText style={styles.navigationTitle}>{item.title}</ThemedText>
                      <ThemedText style={styles.navigationDescription}>
                        {item.description}
                      </ThemedText>
                    </View>
                    <SecurityIcon name="chevron-forward" size={20} color={SecurityColors.text.secondary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencySection}>
            <View style={styles.emergencyCard}>
              <View style={styles.emergencyHeader}>
                <SecurityIcon name="warning" size={24} color={SecurityColors.danger} />
                <ThemedText style={styles.emergencyTitle}>¿Emergencia?</ThemedText>
              </View>
              <ThemedText style={styles.emergencyText}>
                Si estás en peligro inmediato, llama al 105 o usa el botón de emergencia
              </ThemedText>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => onNavigate('emergency')}
              >
                <SecurityIcon name="call" size={20} color={SecurityColors.background.light} />
                <ThemedText style={styles.emergencyButtonText}>Contactar Emergencias</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
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
  menuButton: {
    padding: 12,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: SecurityColors.background.light,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  headerButton: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: SecurityColors.background.light,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: SecurityColors.background.light,
    zIndex: 1000,
    borderRightWidth: 1,
    borderRightColor: SecurityColors.border.light,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SecurityColors.border.light,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SecurityColors.border.light,
  },
  sidebarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sidebarItemText: {
    flex: 1,
  },
  sidebarItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  sidebarItemDescription: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    minWidth: (width - 48) / 3,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
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
  navigationGrid: {
    gap: 12,
  },
  navigationCard: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  navigationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  navigationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  navigationText: {
    flex: 1,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  navigationDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  emergencySection: {
    marginBottom: 24,
  },
  emergencyCard: {
    backgroundColor: SecurityColors.danger + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: SecurityColors.danger + '30',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.danger,
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SecurityColors.danger,
    borderRadius: 8,
    padding: 12,
  },
  emergencyButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
    marginLeft: 8,
  },
});



