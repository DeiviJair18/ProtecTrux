import { SecurityButton } from '@/components/auth/SecurityButton';
import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { SecurityInput } from '@/components/auth/SecurityInput';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { SecurityReportsService } from '@/services/security-reports.service';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface CitizenReportFormProps {
  onBack: () => void;
}

export function CitizenReportForm({ onBack }: CitizenReportFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'theft' as 'theft' | 'violence' | 'accident' | 'suspicious' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
  });

  const categories = [
    { value: 'theft', label: 'Robo', icon: 'shield' },
    { value: 'violence', label: 'Violencia', icon: 'warning' },
    { value: 'accident', label: 'Accidente', icon: 'car' },
    { value: 'suspicious', label: 'Actividad Sospechosa', icon: 'eye' },
    { value: 'other', label: 'Otro', icon: 'help' },
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: SecurityColors.success },
    { value: 'medium', label: 'Media', color: SecurityColors.warning },
    { value: 'high', label: 'Alta', color: SecurityColors.danger },
    { value: 'critical', label: 'Crítica', color: SecurityColors.danger },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const getCurrentLocation = () => {
    // Simular obtención de ubicación
    Alert.alert(
      'Ubicación',
      'Obteniendo tu ubicación actual...',
      [{ text: 'OK' }]
    );
    
    // En una implementación real, se usaría el GPS
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        latitude: -8.1115,
        longitude: -79.0289,
        address: 'Trujillo, La Libertad, Perú'
      }
    }));
  };

  const handleSubmit = async () => {
    // Validaciones del formulario
    if (!formData.title.trim()) {
      Alert.alert('Error', 'El título del reporte es requerido');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'La descripción del incidente es requerida');
      return;
    }

    if (!formData.location.address.trim()) {
      Alert.alert('Error', 'La ubicación del incidente es requerida');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      return;
    }

    try {
      setLoading(true);
      
      const reportData = {
        userId: user.id,
        userEmail: user.email,
        userName: `${user.name} ${user.lastName}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        location: {
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
          address: formData.location.address.trim(),
        },
        status: 'pending' as const,
      };

      console.log('Enviando reporte:', reportData);

      // Crear reporte en la base de datos
      console.log('Creando reporte en Firestore...');
      console.log('Datos del reporte a guardar:', JSON.stringify(reportData, null, 2));
      
      const reportId = await SecurityReportsService.createReport(reportData);
      
      console.log('✅ Reporte creado exitosamente con ID:', reportId);
      console.log('✅ Reporte guardado en la colección "security_reports" de Firestore');
      
      // Limpiar el formulario
      setFormData({
        title: '',
        description: '',
        category: 'theft',
        priority: 'medium',
        location: {
          address: '',
          latitude: 0,
          longitude: 0,
        },
      });

      Alert.alert(
        '✅ Reporte Enviado Exitosamente',
        `Tu reporte ha sido enviado correctamente.\n\nID del reporte: ${reportId}\n\nRecibirás actualizaciones sobre su estado por email.`,
        [
          {
            text: 'Continuar',
            onPress: () => {
              console.log('🔄 Regresando a la pantalla de inicio...');
              onBack();
            }
          }
        ]
      );

      // Auto-redirigir después de 3 segundos si el usuario no hace clic en "Continuar"
      setTimeout(() => {
        console.log('⏰ Auto-redirigiendo a la pantalla de inicio...');
        onBack();
      }, 3000);
    } catch (error) {
      console.error('Error creando reporte:', error);
      
      let errorMessage = 'No se pudo enviar el reporte. Inténtalo de nuevo.';
      
      if (error instanceof Error) {
        if (error.message.includes('network')) {
          errorMessage = 'Error de conexión. Verifica tu internet e inténtalo de nuevo.';
        } else if (error.message.includes('permission')) {
          errorMessage = 'No tienes permisos para crear reportes. Contacta al administrador.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Se ha excedido el límite de reportes. Inténtalo más tarde.';
        }
      }
      
      Alert.alert(
        '❌ Error al Enviar Reporte',
        errorMessage,
        [
          { text: 'Reintentar', onPress: () => handleSubmit() },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Crear Reporte</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Form */}
        <View style={styles.form}>
          {/* Título */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Título del Reporte *</ThemedText>
            <SecurityInput
              placeholder="Describe brevemente el incidente"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              style={styles.input}
            />
          </View>

          {/* Descripción */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Descripción Detallada *</ThemedText>
            <TextInput
              style={[styles.textArea, { color: SecurityColors.text.primary }]}
              placeholder="Proporciona todos los detalles del incidente"
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Categoría */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Categoría</ThemedText>
            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.value}
                  style={[
                    styles.categoryCard,
                    formData.category === category.value && styles.categoryCardSelected
                  ]}
                  onPress={() => handleInputChange('category', category.value)}
                >
                  <SecurityIcon
                    name={category.icon}
                    size={20}
                    color={formData.category === category.value ? SecurityColors.primary : SecurityColors.text.secondary}
                  />
                  <ThemedText
                    style={[
                      styles.categoryText,
                      formData.category === category.value && styles.categoryTextSelected
                    ]}
                  >
                    {category.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Prioridad */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Prioridad</ThemedText>
            <View style={styles.priorityGrid}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.value}
                  style={[
                    styles.priorityCard,
                    { borderColor: priority.color },
                    formData.priority === priority.value && { backgroundColor: priority.color + '20' }
                  ]}
                  onPress={() => handleInputChange('priority', priority.value)}
                >
                  <View style={[styles.priorityIndicator, { backgroundColor: priority.color }]} />
                  <ThemedText
                    style={[
                      styles.priorityText,
                      formData.priority === priority.value && { color: priority.color, fontWeight: 'bold' }
                    ]}
                  >
                    {priority.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Ubicación */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Ubicación</ThemedText>
            <SecurityInput
              placeholder="Dirección del incidente"
              value={formData.location.address}
              onChangeText={(text) => handleLocationChange('address', text)}
              style={styles.input}
            />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={getCurrentLocation}
            >
              <SecurityIcon name="location" size={20} color={SecurityColors.primary} />
              <ThemedText style={styles.locationButtonText}>
                Usar mi ubicación actual
              </ThemedText>
            </TouchableOpacity>
          </View>


          {/* Submit Button */}
          <SecurityButton
            title={loading ? "Enviando Reporte..." : "📤 Enviar Reporte"}
            onPress={handleSubmit}
            loading={loading}
            style={[styles.submitButton, loading && styles.submitButtonLoading]}
            disabled={loading}
          />
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
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  input: {
    backgroundColor: SecurityColors.background.light,
  },
  textArea: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: SecurityColors.border.light,
    fontSize: 16,
    minHeight: 100,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: SecurityColors.border.light,
  },
  categoryCardSelected: {
    borderColor: SecurityColors.primary,
    backgroundColor: SecurityColors.primary + '10',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  categoryTextSelected: {
    color: SecurityColors.primary,
    fontWeight: '600',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.primary + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  locationButtonText: {
    marginLeft: 8,
    color: SecurityColors.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: SecurityColors.primary,
  },
  submitButtonLoading: {
    backgroundColor: SecurityColors.primary + '80',
    opacity: 0.8,
  },
});
