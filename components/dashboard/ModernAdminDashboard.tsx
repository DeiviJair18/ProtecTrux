import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DashboardStats {
  totalUsers: number;
  activeReports: number;
  resolvedReports: number;
  activeOfficers: number;
  emergencyReports: number;
  totalRevenue: number;
  responseTime: number;
  userGrowth: number;
}

interface ModernAdminDashboardProps {
  onNavigate: (screen: string) => void;
}

const { width } = Dimensions.get('window');

export function ModernAdminDashboard({ onNavigate }: ModernAdminDashboardProps) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeReports: 0,
    resolvedReports: 0,
    activeOfficers: 0,
    emergencyReports: 0,
    totalRevenue: 0,
    responseTime: 0,
    userGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Simular carga de estadísticas reales
      setStats({
        totalUsers: 1247,
        activeReports: 23,
        resolvedReports: 89,
        activeOfficers: 45,
        emergencyReports: 5,
        totalRevenue: 3465000,
        responseTime: 12.5,
        userGrowth: 2.5
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'grid',
      active: true
    },
    {
      id: 'users',
      title: 'Usuarios',
      icon: 'people',
      count: stats.totalUsers
    },
    {
      id: 'reports',
      title: 'Reportes',
      icon: 'document-text',
      count: stats.activeReports
    },
    {
      id: 'emergencies',
      title: 'Emergencias',
      icon: 'call',
      count: stats.emergencyReports,
      urgent: true
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: 'notifications',
      count: 12
    },
    {
      id: 'analytics',
      title: 'Analíticas',
      icon: 'bar-chart'
    },
    {
      id: 'settings',
      title: 'Configuración',
      icon: 'settings'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'report',
      title: 'Nuevo reporte de robo',
      time: 'Hace 5 minutos',
      status: 'pending',
      location: 'Centro Histórico'
    },
    {
      id: '2',
      type: 'user',
      title: 'Usuario registrado',
      time: 'Hace 12 minutos',
      status: 'success',
      user: 'María González'
    },
    {
      id: '3',
      type: 'emergency',
      title: 'Emergencia médica',
      time: 'Hace 25 minutos',
      status: 'responding',
      location: 'Mercado Central'
    },
    {
      id: '4',
      type: 'report',
      title: 'Reporte resuelto',
      time: 'Hace 1 hora',
      status: 'resolved',
      location: 'Plaza de Armas'
    }
  ];

  const topLocations = [
    { name: 'Centro Histórico', percentage: 25, reports: 67 },
    { name: 'Plaza de Armas', percentage: 19, reports: 45 },
    { name: 'Mercado Central', percentage: 15, reports: 38 },
    { name: 'Parque Central', percentage: 13, reports: 29 },
    { name: 'Zona Norte', percentage: 12, reports: 22 },
    { name: 'Zona Sur', percentage: 8, reports: 15 },
    { name: 'Universidad', percentage: 5, reports: 12 },
    { name: 'Aeropuerto', percentage: 3, reports: 8 }
  ];

  const reportTypes = [
    { type: 'Robo', percentage: 25, count: 45, color: SecurityColors.status.danger },
    { type: 'Emergencia', percentage: 19, count: 32, color: SecurityColors.status.warning },
    { type: 'Vandalismo', percentage: 17, count: 28, color: SecurityColors.status.info },
    { type: 'Sospechoso', percentage: 13, count: 19, color: SecurityColors.status.safe },
    { type: 'Tránsito', percentage: 11, count: 15, color: SecurityColors.trujillo.gold },
    { type: 'Otros', percentage: 15, count: 25, color: SecurityColors.text.secondary }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return 'document-text';
      case 'user':
        return 'person-add';
      case 'emergency':
        return 'call';
      default:
        return 'notifications';
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'pending':
        return SecurityColors.status.warning;
      case 'success':
        return SecurityColors.status.safe;
      case 'responding':
        return SecurityColors.status.info;
      case 'resolved':
        return SecurityColors.status.safe;
      default:
        return SecurityColors.text.secondary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={[styles.sidebar, sidebarOpen && styles.sidebarOpen]}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logo}>
            <SecurityIcon name="shield-checkmark" size={24} color={SecurityColors.background.light} />
            <ThemedText style={styles.logoText}>SecureTrux</ThemedText>
          </View>
        </View>

        <View style={styles.navigation}>
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, item.active && styles.navItemActive]}
              onPress={() => {
                if (item.id === 'dashboard') {
                  setSidebarOpen(false);
                } else {
                  onNavigate(item.id);
                }
              }}
            >
              <View style={styles.navItemContent}>
                <SecurityIcon 
                  name={item.icon} 
                  size={20} 
                  color={item.active ? SecurityColors.background.light : SecurityColors.text.secondary} 
                />
                <ThemedText style={[
                  styles.navItemText,
                  item.active && styles.navItemTextActive
                ]}>
                  {item.title}
                </ThemedText>
              </View>
              {item.count && (
                <View style={[
                  styles.navItemCount,
                  item.urgent && styles.navItemCountUrgent
                ]}>
                  <ThemedText style={[
                    styles.navItemCountText,
                    item.urgent && styles.navItemCountTextUrgent
                  ]}>
                    {item.count}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.userProfile}>
          <View style={styles.userAvatar}>
            <SecurityIcon name="person" size={20} color={SecurityColors.text.primary} />
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{user?.name} {user?.lastName}</ThemedText>
            <ThemedText style={styles.userRole}>Administrador</ThemedText>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <SecurityIcon name="log-out" size={16} color={SecurityColors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            <SecurityIcon name="menu" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Dashboard</ThemedText>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <SecurityIcon name="notifications" size={20} color={SecurityColors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <SecurityIcon name="settings" size={20} color={SecurityColors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <ThemedText style={styles.statLabel}>Total Usuarios</ThemedText>
                <SecurityIcon name="trending-up" size={16} color={SecurityColors.status.safe} />
              </View>
              <ThemedText style={styles.statNumber}>{formatNumber(stats.totalUsers)}</ThemedText>
              <ThemedText style={styles.statChange}>+{stats.userGrowth}% este mes</ThemedText>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <ThemedText style={styles.statLabel}>Reportes Activos</ThemedText>
                <SecurityIcon name="trending-up" size={16} color={SecurityColors.status.warning} />
              </View>
              <ThemedText style={styles.statNumber}>{stats.activeReports}</ThemedText>
              <ThemedText style={styles.statChange}>+2.5% esta semana</ThemedText>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <ThemedText style={styles.statLabel}>Reportes Resueltos</ThemedText>
                <SecurityIcon name="trending-up" size={16} color={SecurityColors.status.safe} />
              </View>
              <ThemedText style={styles.statNumber}>{stats.resolvedReports}</ThemedText>
              <ThemedText style={styles.statChange}>+0.5% esta semana</ThemedText>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <ThemedText style={styles.statLabel}>Tiempo de Respuesta</ThemedText>
                <SecurityIcon name="trending-down" size={16} color={SecurityColors.status.danger} />
              </View>
              <ThemedText style={styles.statNumber}>{stats.responseTime}m</ThemedText>
              <ThemedText style={styles.statChange}>-0.2% esta semana</ThemedText>
            </View>
          </View>

          {/* Charts Section */}
          <View style={styles.chartsSection}>
            {/* Report Types Chart */}
            <View style={styles.chartCard}>
              <ThemedText style={styles.chartTitle}>Tipos de Reportes</ThemedText>
              <View style={styles.chartContent}>
                <View style={styles.chartList}>
                  {reportTypes.map((item, index) => (
                    <View key={index} style={styles.chartItem}>
                      <View style={styles.chartItemInfo}>
                        <View style={[styles.chartItemColor, { backgroundColor: item.color }]} />
                        <ThemedText style={styles.chartItemLabel}>{item.type}</ThemedText>
                      </View>
                      <View style={styles.chartItemStats}>
                        <ThemedText style={styles.chartItemPercentage}>{item.percentage}%</ThemedText>
                        <ThemedText style={styles.chartItemCount}>{item.count}</ThemedText>
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.chartVisual}>
                  {/* Donut Chart Placeholder */}
                  <View style={styles.donutChart}>
                    <View style={styles.donutInner}>
                      <ThemedText style={styles.donutText}>Total</ThemedText>
                      <ThemedText style={styles.donutNumber}>168</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Top Locations Chart */}
            <View style={styles.chartCard}>
              <ThemedText style={styles.chartTitle}>Ubicaciones Más Reportadas</ThemedText>
              <View style={styles.chartContent}>
                <View style={styles.locationsList}>
                  {topLocations.map((location, index) => (
                    <View key={index} style={styles.locationItem}>
                      <View style={styles.locationInfo}>
                        <View style={styles.locationRank}>
                          <ThemedText style={styles.locationRankNumber}>{index + 1}</ThemedText>
                        </View>
                        <ThemedText style={styles.locationName}>{location.name}</ThemedText>
                      </View>
                      <View style={styles.locationStats}>
                        <ThemedText style={styles.locationPercentage}>{location.percentage}%</ThemedText>
                        <ThemedText style={styles.locationCount}>{location.reports} reportes</ThemedText>
                      </View>
                      <View style={styles.locationBar}>
                        <View 
                          style={[
                            styles.locationBarFill, 
                            { 
                              width: `${location.percentage}%`,
                              backgroundColor: SecurityColors.trujillo.gold
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <ThemedText style={styles.sectionTitle}>Actividad Reciente</ThemedText>
            <View style={styles.activityList}>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <SecurityIcon 
                      name={getActivityIcon(activity.type)} 
                      size={20} 
                      color={getActivityColor(activity.status)} 
                    />
                  </View>
                  <View style={styles.activityContent}>
                    <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                    <ThemedText style={styles.activityDetails}>
                      {activity.location || activity.user} • {activity.time}
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.activityStatus,
                    { backgroundColor: getActivityColor(activity.status) + '20' }
                  ]}>
                    <ThemedText style={[
                      styles.activityStatusText,
                      { color: getActivityColor(activity.status) }
                    ]}>
                      {activity.status === 'pending' ? 'Pendiente' :
                       activity.status === 'success' ? 'Completado' :
                       activity.status === 'responding' ? 'Respondiendo' : 'Resuelto'}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setSidebarOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: SecurityColors.background.card,
    borderRightWidth: 1,
    borderRightColor: SecurityColors.background.light,
    paddingTop: 20,
    position: 'absolute',
    left: -280,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sidebarOpen: {
    left: 0,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: SecurityColors.background.light,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  navigation: {
    paddingTop: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: SecurityColors.status.info,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navItemText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  navItemTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  navItemCount: {
    backgroundColor: SecurityColors.background.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  navItemCountUrgent: {
    backgroundColor: SecurityColors.status.danger,
  },
  navItemCountText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    fontWeight: '600',
  },
  navItemCountTextUrgent: {
    color: SecurityColors.background.light,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: SecurityColors.background.light,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  userRole: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  logoutButton: {
    padding: 8,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: SecurityColors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: SecurityColors.background.light,
    minHeight: 80,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: width > 768 ? '22%' : '45%',
    backgroundColor: SecurityColors.background.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  chartsSection: {
    gap: 20,
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: SecurityColors.background.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  chartContent: {
    flexDirection: 'row',
    gap: 20,
  },
  chartList: {
    flex: 1,
  },
  chartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  chartItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartItemColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chartItemLabel: {
    fontSize: 14,
    color: SecurityColors.text.primary,
  },
  chartItemStats: {
    alignItems: 'flex-end',
  },
  chartItemPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  chartItemCount: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  chartVisual: {
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutChart: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: SecurityColors.status.info,
  },
  donutInner: {
    alignItems: 'center',
  },
  donutText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  donutNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  locationsList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationRank: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: SecurityColors.trujillo.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SecurityColors.trujillo.gold,
  },
  locationName: {
    fontSize: 14,
    color: SecurityColors.text.primary,
    flex: 1,
  },
  locationStats: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  locationPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  locationCount: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  locationBar: {
    width: 60,
    height: 4,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  locationBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  activitySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  activityList: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SecurityColors.background.light,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  activityDetails: {
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
});

