import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

interface AdvancedChartsProps {
  onBack: () => void;
}

export function AdvancedCharts({ onBack }: AdvancedChartsProps) {
  const reportTrends: ChartData[] = [
    { label: 'Robo', value: 45, color: SecurityColors.status.danger, percentage: 25 },
    { label: 'Emergencia', value: 32, color: SecurityColors.status.warning, percentage: 19 },
    { label: 'Vandalismo', value: 28, color: SecurityColors.status.info, percentage: 17 },
    { label: 'Sospechoso', value: 19, color: SecurityColors.status.safe, percentage: 13 },
    { label: 'Tránsito', value: 15, color: SecurityColors.trujillo.gold, percentage: 11 },
    { label: 'Otros', value: 25, color: SecurityColors.text.secondary, percentage: 15 }
  ];

  const monthlyData = [
    { month: 'Ene', reports: 45, resolved: 42 },
    { month: 'Feb', reports: 67, resolved: 61 },
    { month: 'Mar', reports: 89, resolved: 78 },
    { month: 'Abr', reports: 112, resolved: 98 },
    { month: 'May', reports: 134, resolved: 125 },
    { month: 'Jun', reports: 156, resolved: 142 }
  ];

  const locationData = [
    { location: 'Centro Histórico', reports: 67, percentage: 25 },
    { location: 'Plaza de Armas', reports: 45, percentage: 19 },
    { location: 'Mercado Central', reports: 38, percentage: 15 },
    { location: 'Parque Central', reports: 29, percentage: 13 },
    { location: 'Zona Norte', reports: 22, percentage: 12 },
    { location: 'Zona Sur', reports: 15, percentage: 8 },
    { location: 'Universidad', reports: 12, percentage: 5 },
    { location: 'Aeropuerto', reports: 8, percentage: 3 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.reports, d.resolved)));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Analíticas Avanzadas</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.exportButton}>
            <SecurityIcon name="download" size={20} color={SecurityColors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Report Trends Chart */}
        <View style={styles.chartCard}>
          <ThemedText style={styles.chartTitle}>Tendencias de Reportes</ThemedText>
          <View style={styles.chartContent}>
            <View style={styles.chartList}>
              {reportTrends.map((item, index) => (
                <View key={index} style={styles.chartItem}>
                  <View style={styles.chartItemInfo}>
                    <View style={[styles.chartItemColor, { backgroundColor: item.color }]} />
                    <ThemedText style={styles.chartItemLabel}>{item.label}</ThemedText>
                  </View>
                  <View style={styles.chartItemStats}>
                    <ThemedText style={styles.chartItemPercentage}>{item.percentage}%</ThemedText>
                    <ThemedText style={styles.chartItemCount}>{item.value} reportes</ThemedText>
                  </View>
                  <View style={styles.chartBar}>
                    <View 
                      style={[
                        styles.chartBarFill, 
                        { 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }
                      ]} 
                    />
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.donutChartContainer}>
              <View style={styles.donutChart}>
                <View style={styles.donutInner}>
                  <ThemedText style={styles.donutText}>Total</ThemedText>
                  <ThemedText style={styles.donutNumber}>164</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Trends */}
        <View style={styles.chartCard}>
          <ThemedText style={styles.chartTitle}>Tendencias Mensuales</ThemedText>
          <View style={styles.monthlyChart}>
            <View style={styles.chartHeader}>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: SecurityColors.status.info }]} />
                  <ThemedText style={styles.legendText}>Reportes</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: SecurityColors.status.safe }]} />
                  <ThemedText style={styles.legendText}>Resueltos</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.barChart}>
              {monthlyData.map((data, index) => (
                <View key={index} style={styles.barChartItem}>
                  <View style={styles.barChartBars}>
                    <View style={styles.barChartBar}>
                      <View 
                        style={[
                          styles.barChartBarFill, 
                          { 
                            height: `${(data.reports / maxValue) * 100}%`,
                            backgroundColor: SecurityColors.status.info
                          }
                        ]} 
                      />
                    </View>
                    <View style={styles.barChartBar}>
                      <View 
                        style={[
                          styles.barChartBarFill, 
                          { 
                            height: `${(data.resolved / maxValue) * 100}%`,
                            backgroundColor: SecurityColors.status.safe
                          }
                        ]} 
                      />
                    </View>
                  </View>
                  <ThemedText style={styles.barChartLabel}>{data.month}</ThemedText>
                  <View style={styles.barChartValues}>
                    <ThemedText style={styles.barChartValue}>{data.reports}</ThemedText>
                    <ThemedText style={styles.barChartValue}>{data.resolved}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Location Heatmap */}
        <View style={styles.chartCard}>
          <ThemedText style={styles.chartTitle}>Mapa de Calor - Ubicaciones</ThemedText>
          <View style={styles.heatmapContainer}>
            <View style={styles.heatmapGrid}>
              {locationData.map((location, index) => (
                <View key={index} style={styles.heatmapItem}>
                  <View style={styles.heatmapInfo}>
                    <ThemedText style={styles.heatmapName}>{location.location}</ThemedText>
                    <ThemedText style={styles.heatmapCount}>{location.reports} reportes</ThemedText>
                  </View>
                  <View style={styles.heatmapBar}>
                    <View 
                      style={[
                        styles.heatmapBarFill, 
                        { 
                          width: `${location.percentage}%`,
                          backgroundColor: SecurityColors.trujillo.gold
                        }
                      ]} 
                    />
                  </View>
                  <ThemedText style={styles.heatmapPercentage}>{location.percentage}%</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.chartCard}>
          <ThemedText style={styles.chartTitle}>Métricas de Rendimiento</ThemedText>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <SecurityIcon name="time" size={24} color={SecurityColors.status.info} />
              <ThemedText style={styles.metricLabel}>Tiempo Promedio</ThemedText>
              <ThemedText style={styles.metricValue}>12.5 min</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <SecurityIcon name="checkmark-circle" size={24} color={SecurityColors.status.safe} />
              <ThemedText style={styles.metricLabel}>Tasa de Resolución</ThemedText>
              <ThemedText style={styles.metricValue}>89.2%</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <SecurityIcon name="people" size={24} color={SecurityColors.trujillo.gold} />
              <ThemedText style={styles.metricLabel}>Usuarios Activos</ThemedText>
              <ThemedText style={styles.metricValue}>1,247</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <SecurityIcon name="shield-checkmark" size={24} color={SecurityColors.status.warning} />
              <ThemedText style={styles.metricLabel}>Oficiales Activos</ThemedText>
              <ThemedText style={styles.metricValue}>45</ThemedText>
            </View>
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
    paddingTop: 10,
    backgroundColor: SecurityColors.background.card,
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
  content: {
    flex: 1,
    padding: 20,
  },
  chartCard: {
    backgroundColor: SecurityColors.background.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
    marginBottom: 16,
  },
  chartItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  chartItemColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chartItemLabel: {
    fontSize: 14,
    color: SecurityColors.text.primary,
    flex: 1,
  },
  chartItemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  chartBar: {
    height: 6,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  donutChartContainer: {
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
  monthlyChart: {
    gap: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
  },
  barChartItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barChartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 80,
  },
  barChartBar: {
    width: 12,
    height: '100%',
    backgroundColor: SecurityColors.background.light,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barChartBarFill: {
    width: '100%',
    borderRadius: 6,
  },
  barChartLabel: {
    fontSize: 10,
    color: SecurityColors.text.secondary,
    marginTop: 4,
  },
  barChartValues: {
    flexDirection: 'row',
    gap: 4,
  },
  barChartValue: {
    fontSize: 8,
    color: SecurityColors.text.muted,
  },
  heatmapContainer: {
    gap: 12,
  },
  heatmapGrid: {
    gap: 8,
  },
  heatmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heatmapInfo: {
    flex: 1,
  },
  heatmapName: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 2,
  },
  heatmapCount: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
  },
  heatmapBar: {
    width: 60,
    height: 6,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  heatmapBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  heatmapPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    minWidth: 30,
    textAlign: 'right',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: SecurityColors.background.light,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
});

