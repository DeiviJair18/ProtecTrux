import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DashboardStats {
  totalUsers: number;
  activeReports: number;
  resolvedReports: number;
  activeOfficers: number;
  emergencyReports: number;
}

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeReports: 0,
    resolvedReports: 0,
    activeOfficers: 0,
    emergencyReports: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Simular carga de estadísticas
      // En una implementación real, harías llamadas a Firestore
      setStats({
        totalUsers: 1247,
        activeReports: 23,
        resolvedReports: 89,
        activeOfficers: 45,
        emergencyReports: 5
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      subtitle: 'Administrar usuarios',
      icon: 'people',
      color: SecurityColors.status.info,
      onPress: () => onNavigate('users')
    },
    {
      id: 'reports',
      title: 'Reportes Activos',
      subtitle: `${stats.activeReports} pendientes`,
      icon: 'document-text',
      color: SecurityColors.status.warning,
      onPress: () => onNavigate('reports')
    },
    {
      id: 'emergencies',
      title: 'Emergencias',
      subtitle: `${stats.emergencyReports} activas`,
      icon: 'call',
      color: SecurityColors.status.danger,
      onPress: () => onNavigate('emergencies')
    },
    {
      id: 'officers',
      title: 'Oficiales Activos',
      subtitle: `${stats.activeOfficers} en servicio`,
      icon: 'shield-checkmark',
      color: SecurityColors.status.safe,
      onPress: () => onNavigate('officers')
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      subtitle: 'Centro de alertas',
      icon: 'notifications',
      color: SecurityColors.status.warning,
      onPress: () => onNavigate('notifications')
    },
    {
      id: 'analytics',
      title: 'Analíticas',
      subtitle: 'Estadísticas del sistema',
      icon: 'bar-chart',
      color: SecurityColors.trujillo.gold,
      onPress: () => onNavigate('analytics')
    },
    {
      id: 'settings',
      title: 'Configuración',
      subtitle: 'Ajustes del sistema',
      icon: 'settings',
      color: SecurityColors.text.secondary,
      onPress: () => onNavigate('settings')
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'report',
      title: 'Nuevo reporte de robo',
      time: 'Hace 5 minutos',
      status: 'pending'
    },
    {
      id: '2',
      type: 'user',
      title: 'Usuario registrado',
      time: 'Hace 12 minutos',
      status: 'success'
    },
    {
      id: '3',
      type: 'emergency',
      title: 'Emergencia resuelta',
      time: 'Hace 25 minutos',
      status: 'resolved'
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con información del administrador */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <SecurityIcon name="person" size={40} color={SecurityColors.trujillo.gold} />
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={styles.userName}>{user?.name} {user?.lastName}</ThemedText>
            <ThemedText style={styles.userRole}>Administrador del Sistema</ThemedText>
            <View style={styles.badgeContainer}>
              <SecurityIcon name="shield-checkmark" size={16} color={SecurityColors.trujillo.gold} />
              <ThemedText style={styles.badgeText}>Placa: {user?.badge}</ThemedText>
            </View>
            <ThemedText style={styles.department}>{user?.department}</ThemedText>
          </View>
        </View>
      </View>

      {/* Estadísticas principales */}
      <View style={styles.statsSection}>
        <ThemedText style={styles.sectionTitle}>Estadísticas del Sistema</ThemedText>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <SecurityIcon name="people" size={24} color={SecurityColors.status.info} />
            <ThemedText style={styles.statNumber}>{stats.totalUsers}</ThemedText>
            <ThemedText style={styles.statLabel}>Usuarios Totales</ThemedText>
          </View>
          <View style={styles.statCard}>
            <SecurityIcon name="document-text" size={24} color={SecurityColors.status.warning} />
            <ThemedText style={styles.statNumber}>{stats.activeReports}</ThemedText>
            <ThemedText style={styles.statLabel}>Reportes Activos</ThemedText>
          </View>
          <View style={styles.statCard}>
            <SecurityIcon name="checkmark-circle" size={24} color={SecurityColors.status.safe} />
            <ThemedText style={styles.statNumber}>{stats.resolvedReports}</ThemedText>
            <ThemedText style={styles.statLabel}>Resueltos</ThemedText>
          </View>
          <View style={styles.statCard}>
            <SecurityIcon name="shield-checkmark" size={24} color={SecurityColors.trujillo.gold} />
            <ThemedText style={styles.statNumber}>{stats.activeOfficers}</ThemedText>
            <ThemedText style={styles.statLabel}>Oficiales Activos</ThemedText>
          </View>
        </View>
      </View>

      {/* Acciones rápidas */}
      <View style={styles.actionsSection}>
        <ThemedText style={styles.sectionTitle}>Panel de Control</ThemedText>
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                <SecurityIcon name={action.icon} size={24} color={action.color} />
              </View>
              <ThemedText style={styles.actionTitle}>{action.title}</ThemedText>
              <ThemedText style={styles.actionSubtitle}>{action.subtitle}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actividad reciente */}
      <View style={styles.activitySection}>
        <ThemedText style={styles.sectionTitle}>Actividad Reciente</ThemedText>
        <View style={styles.activityList}>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <SecurityIcon 
                  name={activity.type === 'report' ? 'document-text' : 
                        activity.type === 'user' ? 'person-add' : 'call'} 
                  size={20} 
                  color={activity.status === 'pending' ? SecurityColors.status.warning :
                          activity.status === 'success' ? SecurityColors.status.safe :
                          SecurityColors.status.info} 
                />
              </View>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
              </View>
              <View style={[styles.activityStatus, { 
                backgroundColor: activity.status === 'pending' ? SecurityColors.status.warning + '20' :
                               activity.status === 'success' ? SecurityColors.status.safe + '20' :
                               SecurityColors.status.info + '20'
              }]}>
                <ThemedText style={[styles.activityStatusText, {
                  color: activity.status === 'pending' ? SecurityColors.status.warning :
                         activity.status === 'success' ? SecurityColors.status.safe :
                         SecurityColors.status.info
                }]}>
                  {activity.status === 'pending' ? 'Pendiente' :
                   activity.status === 'success' ? 'Completado' : 'Resuelto'}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Información de Trujillo */}
      <View style={styles.cityInfo}>
        <View style={styles.infoCard}>
          <SecurityIcon name="location" size={32} color={SecurityColors.trujillo.gold} />
          <View style={styles.infoContent}>
            <ThemedText style={styles.infoTitle}>ProtecTrux - Trujillo Seguro</ThemedText>
            <ThemedText style={styles.infoSubtitle}>
              Sistema Integrado de Seguridad Ciudadana
            </ThemedText>
            <ThemedText style={styles.infoDescription}>
              Protegiendo el patrimonio cultural y la seguridad de los trujillanos
            </ThemedText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
  },
  header: {
    padding: 20,
    paddingTop: 10,
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
    backgroundColor: SecurityColors.trujillo.gold + '20',
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionsGrid: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  cityInfo: {
    paddingHorizontal: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 12,
    color: SecurityColors.text.muted,
    lineHeight: 16,
  },
});
