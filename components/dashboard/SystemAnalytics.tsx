import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  emergencyReports: number;
  averageResponseTime: number;
  userGrowth: Array<{ month: string; count: number }>;
  reportTrends: Array<{ type: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
}

interface SystemAnalyticsProps {
  onBack: () => void;
}

export function SystemAnalytics({ onBack }: SystemAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    emergencyReports: 0,
    averageResponseTime: 0,
    userGrowth: [],
    reportTrends: [],
    topLocations: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      // Simular carga de analíticas
      const mockAnalytics: AnalyticsData = {
        totalUsers: 1247,
        activeUsers: 1156,
        inactiveUsers: 91,
        totalReports: 342,
        pendingReports: 23,
        resolvedReports: 298,
        emergencyReports: 21,
        averageResponseTime: 12.5,
        userGrowth: [
          { month: 'Ene', count: 45 },
          { month: 'Feb', count: 67 },
          { month: 'Mar', count: 89 },
          { month: 'Abr', count: 112 },
          { month: 'May', count: 134 },
          { month: 'Jun', count: 156 }
        ],
        reportTrends: [
          { type: 'Robo', count: 45 },
          { type: 'Emergencia', count: 32 },
          { type: 'Vandalismo', count: 28 },
          { type: 'Sospechoso', count: 19 },
          { type: 'Tránsito', count: 15 }
        ],
        topLocations: [
          { location: 'Centro Histórico', count: 67 },
          { location: 'Plaza de Armas', count: 45 },
          { location: 'Mercado Central', count: 38 },
          { location: 'Parque Central', count: 29 },
          { location: 'Zona Norte', count: 22 }
        ]
      };
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error cargando analíticas:', error);
      Alert.alert('Error', 'No se pudieron cargar las analíticas');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week':
        return 'Esta semana';
      case 'month':
        return 'Este mes';
      case 'year':
        return 'Este año';
      default:
        return 'Este mes';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Analíticas del Sistema</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.exportButton}>
            <SecurityIcon name="download" size={20} color={SecurityColors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filtros de período */}
      <View style={styles.periodFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodButtons}>
          {[
            { key: 'week', label: 'Semana' },
            { key: 'month', label: 'Mes' },
            { key: 'year', label: 'Año' }
          ].map(period => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <ThemedText style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive
              ]}>
                {period.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumen general */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Resumen General</ThemedText>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <SecurityIcon name="people" size={24} color={SecurityColors.status.info} />
              <ThemedText style={styles.summaryNumber}>{analytics.totalUsers}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Usuarios Totales</ThemedText>
            </View>
            <View style={styles.summaryCard}>
              <SecurityIcon name="document-text" size={24} color={SecurityColors.status.warning} />
              <ThemedText style={styles.summaryNumber}>{analytics.totalReports}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Reportes Totales</ThemedText>
            </View>
            <View style={styles.summaryCard}>
              <SecurityIcon name="checkmark-circle" size={24} color={SecurityColors.status.safe} />
              <ThemedText style={styles.summaryNumber}>{analytics.resolvedReports}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Resueltos</ThemedText>
            </View>
            <View style={styles.summaryCard}>
              <SecurityIcon name="time" size={24} color={SecurityColors.trujillo.gold} />
              <ThemedText style={styles.summaryNumber}>{analytics.averageResponseTime}m</ThemedText>
              <ThemedText style={styles.summaryLabel}>Tiempo Promedio</ThemedText>
            </View>
          </View>
        </View>

        {/* Estado de usuarios */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Estado de Usuarios</ThemedText>
          <View style={styles.userStatusGrid}>
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, { backgroundColor: SecurityColors.status.safe }]} />
              <ThemedText style={styles.statusNumber}>{analytics.activeUsers}</ThemedText>
              <ThemedText style={styles.statusLabel}>Activos</ThemedText>
            </View>
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, { backgroundColor: SecurityColors.status.danger }]} />
              <ThemedText style={styles.statusNumber}>{analytics.inactiveUsers}</ThemedText>
              <ThemedText style={styles.statusLabel}>Inactivos</ThemedText>
            </View>
          </View>
        </View>

        {/* Estado de reportes */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Estado de Reportes</ThemedText>
          <View style={styles.reportStatusGrid}>
            <View style={styles.reportStatusCard}>
              <SecurityIcon name="warning" size={20} color={SecurityColors.status.warning} />
              <ThemedText style={styles.reportStatusNumber}>{analytics.pendingReports}</ThemedText>
              <ThemedText style={styles.reportStatusLabel}>Pendientes</ThemedText>
            </View>
            <View style={styles.reportStatusCard}>
              <SecurityIcon name="checkmark-circle" size={20} color={SecurityColors.status.safe} />
              <ThemedText style={styles.reportStatusNumber}>{analytics.resolvedReports}</ThemedText>
              <ThemedText style={styles.reportStatusLabel}>Resueltos</ThemedText>
            </View>
            <View style={styles.reportStatusCard}>
              <SecurityIcon name="call" size={20} color={SecurityColors.status.danger} />
              <ThemedText style={styles.reportStatusNumber}>{analytics.emergencyReports}</ThemedText>
              <ThemedText style={styles.reportStatusLabel}>Emergencias</ThemedText>
            </View>
          </View>
        </View>

        {/* Tipos de reportes */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tipos de Reportes</ThemedText>
          <View style={styles.trendsList}>
            {analytics.reportTrends.map((trend, index) => (
              <View key={index} style={styles.trendItem}>
                <View style={styles.trendInfo}>
                  <ThemedText style={styles.trendType}>{trend.type}</ThemedText>
                  <ThemedText style={styles.trendCount}>{trend.count} reportes</ThemedText>
                </View>
                <View style={styles.trendBar}>
                  <View 
                    style={[
                      styles.trendBarFill, 
                      { 
                        width: `${(trend.count / Math.max(...analytics.reportTrends.map(t => t.count))) * 100}%`,
                        backgroundColor: index === 0 ? SecurityColors.status.danger :
                                       index === 1 ? SecurityColors.status.warning :
                                       index === 2 ? SecurityColors.status.info :
                                       SecurityColors.status.safe
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Ubicaciones más reportadas */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ubicaciones Más Reportadas</ThemedText>
          <View style={styles.locationsList}>
            {analytics.topLocations.map((location, index) => (
              <View key={index} style={styles.locationItem}>
                <View style={styles.locationRank}>
                  <ThemedText style={styles.locationRankNumber}>{index + 1}</ThemedText>
                </View>
                <View style={styles.locationInfo}>
                  <ThemedText style={styles.locationName}>{location.location}</ThemedText>
                  <ThemedText style={styles.locationCount}>{location.count} reportes</ThemedText>
                </View>
                <View style={styles.locationBar}>
                  <View 
                    style={[
                      styles.locationBarFill, 
                      { 
                        width: `${(location.count / Math.max(...analytics.topLocations.map(l => l.count))) * 100}%`,
                        backgroundColor: SecurityColors.trujillo.gold
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Crecimiento de usuarios */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Crecimiento de Usuarios</ThemedText>
          <View style={styles.growthChart}>
            {analytics.userGrowth.map((growth, index) => (
              <View key={index} style={styles.growthItem}>
                <View style={styles.growthBar}>
                  <View 
                    style={[
                      styles.growthBarFill, 
                      { 
                        height: `${(growth.count / Math.max(...analytics.userGrowth.map(g => g.count))) * 100}%`,
                        backgroundColor: SecurityColors.status.info
                      }
                    ]} 
                  />
                </View>
                <ThemedText style={styles.growthMonth}>{growth.month}</ThemedText>
                <ThemedText style={styles.growthCount}>{growth.count}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  exportButton: {
    padding: 8,
  },
  periodFilters: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SecurityColors.background.card,
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: SecurityColors.status.info,
  },
  periodButtonText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  periodButtonTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  userStatusGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  statusLabel: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  reportStatusGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  reportStatusCard: {
    flex: 1,
    backgroundColor: SecurityColors.background.card,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  reportStatusNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  reportStatusLabel: {
    fontSize: 10,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  trendsList: {
    gap: 12,
  },
  trendItem: {
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  trendInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendType: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  trendCount: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  trendBar: {
    height: 6,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  locationsList: {
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  locationRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SecurityColors.trujillo.gold + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRankNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: SecurityColors.trujillo.gold,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 2,
  },
  locationCount: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  locationBar: {
    width: 60,
    height: 6,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  locationBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  growthChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    backgroundColor: SecurityColors.background.card,
    padding: 16,
    borderRadius: 12,
    height: 120,
  },
  growthItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  growthBar: {
    width: 20,
    height: 60,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  growthBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  growthMonth: {
    fontSize: 10,
    color: SecurityColors.text.secondary,
  },
  growthCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
});


