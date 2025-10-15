import { AuthGuard } from '@/components/auth/AuthGuard';
import { SecurityButton } from '@/components/auth/SecurityButton';
import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { CitizenDashboard } from '@/components/dashboard/CitizenDashboard';
import { CitizenEmergencyCenter } from '@/components/dashboard/CitizenEmergencyCenter';
import { CitizenMyReports } from '@/components/dashboard/CitizenMyReports';
import { CitizenPanicButton } from '@/components/dashboard/CitizenPanicButton';
import { CitizenPoliceCall } from '@/components/dashboard/CitizenPoliceCall';
import { CitizenProfile } from '@/components/dashboard/CitizenProfile';
import { CitizenReportForm } from '@/components/dashboard/CitizenReportForm';
import { EmergencyCenter } from '@/components/dashboard/EmergencyCenter';
import { ModernAdminDashboard } from '@/components/dashboard/ModernAdminDashboard';
import { NotificationsCenter } from '@/components/dashboard/NotificationsCenter';
import { ReportsManagement } from '@/components/dashboard/ReportsManagement';
import { SystemAnalytics } from '@/components/dashboard/SystemAnalytics';
import { SystemSettings } from '@/components/dashboard/SystemSettings';
import { UserManagement } from '@/components/dashboard/UserManagement';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProtecTruxConfig } from '@/constants/protectrux';
import { SecurityColors, getRoleColor } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeContent() {
  const { user, logout } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('dashboard');

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

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  // Renderizar pantalla según el rol y la pantalla actual
  if (user?.role === 'admin') {
    if (currentScreen === 'users') {
      return <UserManagement onBack={handleBack} />;
    }
    if (currentScreen === 'reports') {
      return <ReportsManagement onBack={handleBack} />;
    }
    if (currentScreen === 'notifications') {
      return <NotificationsCenter onBack={handleBack} />;
    }
    if (currentScreen === 'analytics') {
      return <SystemAnalytics onBack={handleBack} />;
    }
    if (currentScreen === 'settings') {
      return <SystemSettings onBack={handleBack} />;
    }
    if (currentScreen === 'emergencies') {
      return <EmergencyCenter onBack={handleBack} />;
    }
    return <ModernAdminDashboard onNavigate={handleNavigation} />;
  }

  // Dashboard para ciudadanos
  if (user?.role === 'citizen') {
    if (currentScreen === 'reports') {
      return <CitizenReportForm onBack={handleBack} />;
    }
    if (currentScreen === 'my-reports') {
      return <CitizenMyReports onBack={handleBack} />;
    }
    if (currentScreen === 'panic-button') {
      return <CitizenPanicButton onBack={handleBack} />;
    }
    if (currentScreen === 'police-call') {
      return <CitizenPoliceCall onBack={handleBack} />;
    }
    if (currentScreen === 'quick-report') {
      return <CitizenReportForm onBack={handleBack} />;
    }
    if (currentScreen === 'emergency') {
      return <CitizenEmergencyCenter onBack={handleBack} />;
    }
    if (currentScreen === 'profile') {
      return <CitizenProfile onBack={handleBack} />;
    }
    return <CitizenDashboard onNavigate={handleNavigation} />;
  }

  // Dashboard para otros roles (policía, etc.)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          {/* Header con información del usuario */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={[styles.avatar, { backgroundColor: getRoleColor(user?.role || '') + '20' }]}>
                <SecurityIcon
                  name="person"
                  size={40}
                  color={getRoleColor(user?.role || '')}
                />
              </View>
              <View style={styles.userDetails}>
                <ThemedText style={styles.userName}>{user?.name} {user?.lastName}</ThemedText>
                <ThemedText style={styles.userRole}>
                  {getRoleDisplayName(user?.role || '')}
                </ThemedText>
                {user?.badge && (
                  <View style={styles.badgeContainer}>
                    <SecurityIcon name="shield" size={14} color={SecurityColors.trujillo.gold} />
                    <ThemedText style={styles.badgeText}>Placa: {user.badge}</ThemedText>
                  </View>
                )}
                {user?.department && (
                  <ThemedText style={styles.department}>{user.department}</ThemedText>
                )}
              </View>
            </View>
          </View>

          {/* Dashboard principal */}
          <View style={styles.dashboard}>
            <ThemedText style={styles.sectionTitle}>Panel de Control</ThemedText>
            
            <View style={styles.quickActions}>
              <View style={styles.actionCard}>
                <SecurityIcon name="call" size={32} color={SecurityColors.status.danger} />
                <ThemedText style={styles.actionTitle}>Emergencias</ThemedText>
                <ThemedText style={styles.actionSubtitle}>Reportar incidente</ThemedText>
              </View>
              
              <View style={styles.actionCard}>
                <SecurityIcon name="location" size={32} color={SecurityColors.status.info} />
                <ThemedText style={styles.actionTitle}>Patrullaje</ThemedText>
                <ThemedText style={styles.actionSubtitle}>Rutas asignadas</ThemedText>
              </View>
              
              <View style={styles.actionCard}>
                <SecurityIcon name="people" size={32} color={SecurityColors.status.safe} />
                <ThemedText style={styles.actionTitle}>Comunidad</ThemedText>
                <ThemedText style={styles.actionSubtitle}>Reportes ciudadanos</ThemedText>
              </View>
              
              <View style={styles.actionCard}>
                <SecurityIcon name="document-text" size={32} color={SecurityColors.status.warning} />
                <ThemedText style={styles.actionTitle}>Reportes</ThemedText>
                <ThemedText style={styles.actionSubtitle}>Historial de casos</ThemedText>
              </View>
            </View>
          </View>

          {/* Información de Trujillo */}
          <View style={styles.cityInfo}>
            <ThemedText style={styles.sectionTitle}>{ProtecTruxConfig.appName} - Trujillo Seguro</ThemedText>
            <View style={styles.infoCard}>
              <SecurityIcon name="shield-checkmark" size={24} color={SecurityColors.trujillo.gold} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoTitle}>
                  {ProtecTruxConfig.fullName}
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  Protegiendo el patrimonio cultural y la seguridad de los trujillanos
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Botón de logout */}
          <SecurityButton
            title="Cerrar Sesión"
            onPress={logout}
            variant="secondary"
            iconName="log-out"
            style={styles.logoutButton}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.card,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: SecurityColors.trujillo.gold,
    fontWeight: '600',
  },
  department: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  dashboard: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  cityInfo: {
    marginBottom: 30,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: SecurityColors.trujillo.gold + '10',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  logoutButton: {
    marginTop: 20,
  },
});