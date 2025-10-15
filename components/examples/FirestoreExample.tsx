import { useAuth } from '@/hooks/auth/AuthContext';
import { useFirestoreCollection, useFirestoreOperations } from '@/hooks/useFirestore';
import { SecurityReportsService } from '@/services/security-reports.service';
import { SecurityReport } from '@/types/firestore';
import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

// Componente de ejemplo para mostrar cómo usar Firestore
export const FirestoreExample: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // Hook para obtener reportes en tiempo real
  const { data: reports, loading: reportsLoading, error: reportsError } = useFirestoreCollection<SecurityReport>(
    'security_reports',
    user ? [
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    ] : []
  );

  // Hook para operaciones CRUD
  const { create, loading: createLoading, error: createError } = useFirestoreOperations<SecurityReport>('security_reports');

  // Crear nuevo reporte
  const handleCreateReport = async () => {
    if (!user || !reportTitle.trim() || !reportDescription.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      const reportData = {
        userId: user.id,
        title: reportTitle.trim(),
        description: reportDescription.trim(),
        location: {
          latitude: -8.1116, // Coordenadas de Trujillo como ejemplo
          longitude: -79.0287,
          address: 'Trujillo, La Libertad, Perú'
        },
        category: 'other' as const,
        priority: 'medium' as const,
        status: 'pending' as const
      };

      const reportId = await create(reportData);
      
      if (reportId) {
        Alert.alert('Éxito', 'Reporte creado correctamente');
        setReportTitle('');
        setReportDescription('');
      }
    } catch (error) {
      console.error('Error creando reporte:', error);
      Alert.alert('Error', 'No se pudo crear el reporte');
    }
  };

  // Actualizar estado de un reporte
  const handleUpdateReportStatus = async (reportId: string, newStatus: SecurityReport['status']) => {
    try {
      await SecurityReportsService.updateReportStatus(reportId, newStatus);
      Alert.alert('Éxito', 'Estado actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Ejemplo de Firestore</Text>
        <Text style={styles.message}>Por favor inicia sesión para ver este ejemplo</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ejemplo de Firestore - Reportes de Seguridad</Text>
      
      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <Text style={styles.subtitle}>Usuario: {user?.name}</Text>
        <Text style={styles.subtitle}>Email: {user?.email}</Text>
      </View>

      {/* Formulario para crear reporte */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Crear Nuevo Reporte</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Título del reporte"
          value={reportTitle}
          onChangeText={setReportTitle}
          editable={!createLoading}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción del reporte"
          value={reportDescription}
          onChangeText={setReportDescription}
          multiline
          numberOfLines={4}
          editable={!createLoading}
        />
        
        <Button
          title={createLoading ? "Creando..." : "Crear Reporte"}
          onPress={handleCreateReport}
          disabled={createLoading}
        />
        
        {createError && (
          <Text style={styles.error}>Error: {createError}</Text>
        )}
      </View>

      {/* Lista de reportes */}
      <View style={styles.reportsList}>
        <Text style={styles.formTitle}>Mis Reportes ({reports?.length || 0})</Text>
        
        {reportsLoading && (
          <Text style={styles.loading}>Cargando reportes...</Text>
        )}
        
        {reportsError && (
          <Text style={styles.error}>Error cargando reportes: {reportsError}</Text>
        )}
        
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>{item.title}</Text>
              <Text style={styles.reportDescription}>{item.description}</Text>
              <Text style={styles.reportMeta}>
                Estado: {item.status} | Prioridad: {item.priority}
              </Text>
              <Text style={styles.reportMeta}>
                Categoría: {item.category}
              </Text>
              <Text style={styles.reportMeta}>
                Creado: {item.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
              </Text>
              
              {/* Botones para cambiar estado */}
              <View style={styles.actionButtons}>
                {item.status === 'pending' && (
                  <Button
                    title="Marcar en Progreso"
                    onPress={() => handleUpdateReportStatus(item.id, 'in_progress')}
                  />
                )}
                {item.status === 'in_progress' && (
                  <Button
                    title="Marcar Resuelto"
                    onPress={() => handleUpdateReportStatus(item.id, 'resolved')}
                  />
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            !reportsLoading ? (
              <Text style={styles.emptyList}>No tienes reportes aún</Text>
            ) : null
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 8,
  },
  loading: {
    color: '#3498db',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  reportsList: {
    flex: 1,
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reportMeta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  actionButtons: {
    marginTop: 8,
  },
  emptyList: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 32,
  },
});










