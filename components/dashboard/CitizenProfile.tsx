import { SecurityButton } from '@/components/auth/SecurityButton';
import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { SecurityInput } from '@/components/auth/SecurityInput';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { FirestoreService } from '@/services/firestore.service';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CitizenProfileProps {
  onBack: () => void;
}

export function CitizenProfile({ onBack }: CitizenProfileProps) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    emergencyContacts: true,
    darkMode: false,
  });

  const profileSections = [
    {
      title: 'Información Personal',
      items: [
        {
          id: 'name',
          label: 'Nombre',
          value: profileData.name,
          type: 'text',
          editable: true
        },
        {
          id: 'lastName',
          label: 'Apellidos',
          value: profileData.lastName,
          type: 'text',
          editable: true
        },
        {
          id: 'email',
          label: 'Correo Electrónico',
          value: profileData.email,
          type: 'email',
          editable: false
        },
        {
          id: 'phoneNumber',
          label: 'Teléfono',
          value: profileData.phoneNumber,
          type: 'phone',
          editable: true
        },
        {
          id: 'role',
          label: 'Rol',
          value: 'Ciudadano',
          type: 'text',
          editable: false
        }
      ]
    },
    {
      title: 'Configuración',
      items: [
        {
          id: 'notifications',
          label: 'Notificaciones',
          description: 'Recibir notificaciones de reportes',
          type: 'switch',
          value: settings.notifications
        },
        {
          id: 'locationSharing',
          label: 'Compartir Ubicación',
          description: 'Permitir acceso a ubicación para reportes',
          type: 'switch',
          value: settings.locationSharing
        },
        {
          id: 'emergencyContacts',
          label: 'Contactos de Emergencia',
          description: 'Guardar contactos de emergencia',
          type: 'switch',
          value: settings.emergencyContacts
        },
        {
          id: 'darkMode',
          label: 'Modo Oscuro',
          description: 'Usar tema oscuro en la aplicación',
          type: 'switch',
          value: settings.darkMode
        }
      ]
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      await FirestoreService.updateUser(user.id, {
        name: profileData.name,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
      });

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Función no disponible', 'Esta función estará disponible próximamente');
          }
        }
      ]
    );
  };

  const renderProfileItem = (item: any) => {
    if (item.type === 'switch') {
      return (
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <ThemedText style={styles.settingLabel}>{item.label}</ThemedText>
            <ThemedText style={styles.settingDescription}>{item.description}</ThemedText>
          </View>
          <Switch
            value={item.value}
            onValueChange={(value) => handleSettingChange(item.id, value)}
            trackColor={{ false: SecurityColors.border.light, true: SecurityColors.primary }}
            thumbColor={SecurityColors.background.light}
          />
        </View>
      );
    }

    if (editing && item.editable) {
      return (
        <View style={styles.inputItem}>
          <ThemedText style={styles.inputLabel}>{item.label}</ThemedText>
          <SecurityInput
            value={item.value}
            onChangeText={(text) => handleInputChange(item.id, text)}
            keyboardType={item.type === 'email' ? 'email-address' : item.type === 'phone' ? 'phone-pad' : 'default'}
            style={styles.input}
          />
        </View>
      );
    }

    return (
      <View style={styles.profileItem}>
        <ThemedText style={styles.profileLabel}>{item.label}</ThemedText>
        <ThemedText style={styles.profileValue}>{item.value}</ThemedText>
      </View>
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
          <ThemedText style={styles.headerTitle}>Mi Perfil</ThemedText>
        </View>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setEditing(!editing)}
        >
          <SecurityIcon 
            name={editing ? "close" : "create"} 
            size={24} 
            color={SecurityColors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <SecurityIcon name="person" size={40} color={SecurityColors.primary} />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <SecurityIcon name="camera" size={16} color={SecurityColors.background.light} />
            </TouchableOpacity>
          </View>
          <ThemedText style={styles.profileName}>
            {user?.name} {user?.lastName}
          </ThemedText>
          <ThemedText style={styles.profileRole}>Ciudadano</ThemedText>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderProfileItem(item)}
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        {editing && (
          <View style={styles.actionButtons}>
            <SecurityButton
              title="Guardar Cambios"
              onPress={handleSave}
              loading={loading}
              style={styles.saveButton}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditing(false)}
            >
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Cuenta</ThemedText>
          <View style={styles.sectionContent}>
            <TouchableOpacity style={styles.accountAction}>
              <View style={styles.accountActionInfo}>
                <SecurityIcon name="key" size={20} color={SecurityColors.text.secondary} />
                <ThemedText style={styles.accountActionText}>Cambiar Contraseña</ThemedText>
              </View>
              <SecurityIcon name="chevron-forward" size={20} color={SecurityColors.text.secondary} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.accountAction}>
              <View style={styles.accountActionInfo}>
                <SecurityIcon name="download" size={20} color={SecurityColors.text.secondary} />
                <ThemedText style={styles.accountActionText}>Exportar Datos</ThemedText>
              </View>
              <SecurityIcon name="chevron-forward" size={20} color={SecurityColors.text.secondary} />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.accountAction} onPress={handleLogout}>
              <View style={styles.accountActionInfo}>
                <SecurityIcon name="log-out" size={20} color={SecurityColors.danger} />
                <ThemedText style={[styles.accountActionText, { color: SecurityColors.danger }]}>
                  Cerrar Sesión
                </ThemedText>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.accountAction} onPress={handleDeleteAccount}>
              <View style={styles.accountActionInfo}>
                <SecurityIcon name="trash" size={20} color={SecurityColors.danger} />
                <ThemedText style={[styles.accountActionText, { color: SecurityColors.danger }]}>
                  Eliminar Cuenta
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <ThemedText style={styles.appInfoText}>SecureTrux v1.0.0</ThemedText>
          <ThemedText style={styles.appInfoText}>© 2024 Municipalidad de Trujillo</ThemedText>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SecurityColors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SecurityColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  profileRole: {
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
  sectionContent: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 12,
    overflow: 'hidden',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  profileLabel: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  inputItem: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: SecurityColors.background.light,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  separator: {
    height: 1,
    backgroundColor: SecurityColors.border.light,
    marginLeft: 16,
  },
  actionButtons: {
    marginBottom: 24,
    gap: 12,
  },
  saveButton: {
    marginBottom: 0,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
  },
  accountAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  accountActionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountActionText: {
    fontSize: 16,
    color: SecurityColors.text.primary,
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: SecurityColors.text.secondary,
    marginBottom: 4,
  },
});



