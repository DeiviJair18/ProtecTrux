import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

interface SystemSettings {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  notificationsEnabled: boolean;
  autoBackup: boolean;
  backupFrequency: string;
  maxFileSize: number;
  sessionTimeout: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emergencyAlerts: boolean;
  systemLogs: boolean;
  debugMode: boolean;
  apiRateLimit: number;
  maxUsers: number;
  maxReports: number;
  responseTimeThreshold: number;
  emergencyResponseTime: number;
  defaultLanguage: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  theme: string;
}

interface SystemSettingsProps {
  onBack: () => void;
}

export function SystemSettings({ onBack }: SystemSettingsProps) {
  const [settings, setSettings] = useState<SystemSettings>({
    appName: 'SecureTrux',
    appVersion: '1.0.0',
    maintenanceMode: false,
    notificationsEnabled: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maxFileSize: 10,
    sessionTimeout: 30,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    emergencyAlerts: true,
    systemLogs: true,
    debugMode: false,
    apiRateLimit: 1000,
    maxUsers: 10000,
    maxReports: 50000,
    responseTimeThreshold: 15,
    emergencyResponseTime: 5,
    defaultLanguage: 'es',
    timezone: 'America/Lima',
    dateFormat: 'DD/MM/YYYY',
    currency: 'PEN',
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Simular carga de configuración
      setLoading(false);
    } catch (error) {
      console.error('Error cargando configuración:', error);
      Alert.alert('Error', 'No se pudieron cargar las configuraciones');
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      // Simular guardado de configuración
      Alert.alert('Éxito', 'Configuración guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };

  const resetSettings = async () => {
    Alert.alert(
      'Confirmar restablecimiento',
      '¿Estás seguro de que quieres restablecer todas las configuraciones a los valores por defecto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restablecer', 
          style: 'destructive',
          onPress: () => {
            // Restablecer a valores por defecto
            setSettings({
              appName: 'SecureTrux',
              appVersion: '1.0.0',
              maintenanceMode: false,
              notificationsEnabled: true,
              autoBackup: true,
              backupFrequency: 'daily',
              maxFileSize: 10,
              sessionTimeout: 30,
              emailNotifications: true,
              smsNotifications: false,
              pushNotifications: true,
              emergencyAlerts: true,
              systemLogs: true,
              debugMode: false,
              apiRateLimit: 1000,
              maxUsers: 10000,
              maxReports: 50000,
              responseTimeThreshold: 15,
              emergencyResponseTime: 5,
              defaultLanguage: 'es',
              timezone: 'America/Lima',
              dateFormat: 'DD/MM/YYYY',
              currency: 'PEN',
              theme: 'light'
            });
            Alert.alert('Éxito', 'Configuración restablecida');
          }
        }
      ]
    );
  };

  const createBackup = async () => {
    try {
      Alert.alert('Éxito', 'Backup creado correctamente');
      setShowBackupModal(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el backup');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Configuración del Sistema</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={saveSettings} style={styles.saveButton}>
            <SecurityIcon name="checkmark" size={20} color={SecurityColors.background.light} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Información General */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Información General</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Nombre de la Aplicación</ThemedText>
              <TextInput
                style={styles.textInput}
                value={settings.appName}
                onChangeText={(text) => updateSetting('appName', text)}
                placeholder="SecureTrux"
                placeholderTextColor={SecurityColors.text.secondary}
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Versión</ThemedText>
              <ThemedText style={styles.settingValue}>{settings.appVersion}</ThemedText>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Modo de Mantenimiento</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.maintenanceMode}
                  onValueChange={(value) => updateSetting('maintenanceMode', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.maintenanceMode ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.maintenanceMode ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Notificaciones */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notificaciones</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Notificaciones Habilitadas</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={(value) => updateSetting('notificationsEnabled', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.notificationsEnabled ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.notificationsEnabled ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Notificaciones por Email</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.emailNotifications}
                  onValueChange={(value) => updateSetting('emailNotifications', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.emailNotifications ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.emailNotifications ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Notificaciones SMS</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.smsNotifications}
                  onValueChange={(value) => updateSetting('smsNotifications', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.smsNotifications ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.smsNotifications ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Notificaciones Push</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.pushNotifications}
                  onValueChange={(value) => updateSetting('pushNotifications', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.pushNotifications ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.pushNotifications ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Alertas de Emergencia</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.emergencyAlerts}
                  onValueChange={(value) => updateSetting('emergencyAlerts', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.danger }}
                  thumbColor={settings.emergencyAlerts ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.emergencyAlerts ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Backup y Seguridad */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Backup y Seguridad</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Backup Automático</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.autoBackup}
                  onValueChange={(value) => updateSetting('autoBackup', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.autoBackup ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.autoBackup ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Frecuencia de Backup</ThemedText>
              <View style={styles.pickerContainer}>
                {['daily', 'weekly', 'monthly'].map(freq => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.pickerOption,
                      settings.backupFrequency === freq && styles.pickerOptionActive
                    ]}
                    onPress={() => updateSetting('backupFrequency', freq)}
                  >
                    <ThemedText style={[
                      styles.pickerOptionText,
                      settings.backupFrequency === freq && styles.pickerOptionTextActive
                    ]}>
                      {freq === 'daily' ? 'Diario' : freq === 'weekly' ? 'Semanal' : 'Mensual'}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowBackupModal(true)}
            >
              <SecurityIcon name="cloud-upload" size={20} color={SecurityColors.status.info} />
              <ThemedText style={styles.actionButtonText}>Crear Backup Manual</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Límites del Sistema */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Límites del Sistema</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Máximo de Usuarios</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.maxUsers.toString()}
                onChangeText={(text) => updateSetting('maxUsers', parseInt(text) || 0)}
                placeholder="10000"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Máximo de Reportes</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.maxReports.toString()}
                onChangeText={(text) => updateSetting('maxReports', parseInt(text) || 0)}
                placeholder="50000"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Límite de API (req/min)</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.apiRateLimit.toString()}
                onChangeText={(text) => updateSetting('apiRateLimit', parseInt(text) || 0)}
                placeholder="1000"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Tamaño Máximo de Archivo (MB)</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.maxFileSize.toString()}
                onChangeText={(text) => updateSetting('maxFileSize', parseInt(text) || 0)}
                placeholder="10"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Tiempos de Respuesta */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tiempos de Respuesta</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Umbral de Tiempo de Respuesta (min)</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.responseTimeThreshold.toString()}
                onChangeText={(text) => updateSetting('responseTimeThreshold', parseInt(text) || 0)}
                placeholder="15"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Tiempo de Respuesta de Emergencia (min)</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.emergencyResponseTime.toString()}
                onChangeText={(text) => updateSetting('emergencyResponseTime', parseInt(text) || 0)}
                placeholder="5"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Timeout de Sesión (min)</ThemedText>
              <TextInput
                style={styles.numberInput}
                value={settings.sessionTimeout.toString()}
                onChangeText={(text) => updateSetting('sessionTimeout', parseInt(text) || 0)}
                placeholder="30"
                placeholderTextColor={SecurityColors.text.secondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Configuración Regional */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Configuración Regional</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Idioma por Defecto</ThemedText>
              <View style={styles.pickerContainer}>
                {['es', 'en'].map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[
                      styles.pickerOption,
                      settings.defaultLanguage === lang && styles.pickerOptionActive
                    ]}
                    onPress={() => updateSetting('defaultLanguage', lang)}
                  >
                    <ThemedText style={[
                      styles.pickerOptionText,
                      settings.defaultLanguage === lang && styles.pickerOptionTextActive
                    ]}>
                      {lang === 'es' ? 'Español' : 'English'}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Zona Horaria</ThemedText>
              <ThemedText style={styles.settingValue}>{settings.timezone}</ThemedText>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Formato de Fecha</ThemedText>
              <ThemedText style={styles.settingValue}>{settings.dateFormat}</ThemedText>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Moneda</ThemedText>
              <ThemedText style={styles.settingValue}>{settings.currency}</ThemedText>
            </View>
          </View>
        </View>

        {/* Sistema */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Sistema</ThemedText>
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Logs del Sistema</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.systemLogs}
                  onValueChange={(value) => updateSetting('systemLogs', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.info }}
                  thumbColor={settings.systemLogs ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.systemLogs ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
            <View style={styles.settingItem}>
              <ThemedText style={styles.settingLabel}>Modo Debug</ThemedText>
              <View style={styles.switchContainer}>
                <Switch
                  value={settings.debugMode}
                  onValueChange={(value) => updateSetting('debugMode', value)}
                  trackColor={{ false: SecurityColors.background.light, true: SecurityColors.status.warning }}
                  thumbColor={settings.debugMode ? SecurityColors.background.light : SecurityColors.text.secondary}
                />
                <ThemedText style={styles.switchLabel}>
                  {settings.debugMode ? 'Activado' : 'Desactivado'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Acciones del Sistema */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Acciones del Sistema</ThemedText>
          <View style={styles.actionsGroup}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.warningButton]}
              onPress={() => setShowResetModal(true)}
            >
              <SecurityIcon name="refresh" size={20} color={SecurityColors.status.warning} />
              <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.warning }]}>
                Restablecer Configuración
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => Alert.alert('Confirmar', 'Esta acción reiniciará el sistema')}
            >
              <SecurityIcon name="power" size={20} color={SecurityColors.status.danger} />
              <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.danger }]}>
                Reiniciar Sistema
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Backup */}
      <Modal
        visible={showBackupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBackupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Crear Backup</ThemedText>
              <TouchableOpacity onPress={() => setShowBackupModal(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.modalText}>
              ¿Estás seguro de que quieres crear un backup manual del sistema? 
              Esto puede tomar varios minutos.
            </ThemedText>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBackupModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={createBackup}
              >
                <ThemedText style={styles.confirmButtonText}>Crear Backup</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Reset */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Restablecer Configuración</ThemedText>
              <TouchableOpacity onPress={() => setShowResetModal(false)}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.modalText}>
              ¿Estás seguro de que quieres restablecer todas las configuraciones a los valores por defecto? 
              Esta acción no se puede deshacer.
            </ThemedText>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowResetModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dangerConfirmButton}
                onPress={() => {
                  resetSettings();
                  setShowResetModal(false);
                }}
              >
                <ThemedText style={styles.dangerConfirmButtonText}>Restablecer</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  saveButton: {
    backgroundColor: SecurityColors.status.safe,
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    marginBottom: 16,
  },
  settingsGroup: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  settingItem: {
    gap: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
  },
  settingValue: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  textInput: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: SecurityColors.text.primary,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
  },
  numberInput: {
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: SecurityColors.text.primary,
    borderWidth: 1,
    borderColor: SecurityColors.background.light,
    width: 120,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 20,
  },
  pickerOptionActive: {
    backgroundColor: SecurityColors.status.info,
  },
  pickerOptionText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  pickerOptionTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  actionsGroup: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  warningButton: {
    backgroundColor: SecurityColors.status.warning + '20',
  },
  dangerButton: {
    backgroundColor: SecurityColors.status.danger + '20',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  modalText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: SecurityColors.background.light,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: SecurityColors.text.secondary,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: SecurityColors.status.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  dangerConfirmButton: {
    flex: 1,
    backgroundColor: SecurityColors.status.danger,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerConfirmButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
});