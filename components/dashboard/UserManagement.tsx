import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { FirestoreService } from '@/services/firestore.service';
import { User } from '@/types/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  isActive: boolean;
  phoneNumber: string;
  badge?: string;
  department?: string;
  createdAt: Date;
}

interface UserManagementProps {
  onBack: () => void;
}

export function UserManagement({ onBack }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'citizen',
    badge: '',
    department: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [users, searchQuery, filterRole]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const firestoreUsers = await FirestoreService.getAllUsers();
      setUsers(firestoreUsers);
      setFilteredUsers(firestoreUsers);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'police_officer':
        return 'Oficial de Policía';
      case 'security_guard':
        return 'Agente de Seguridad';
      case 'emergency_responder':
        return 'Respondedor de Emergencias';
      default:
        return 'Ciudadano';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return SecurityColors.status.danger;
      case 'police_officer':
        return SecurityColors.status.info;
      case 'security_guard':
        return SecurityColors.status.warning;
      case 'emergency_responder':
        return SecurityColors.status.safe;
      default:
        return SecurityColors.text.secondary;
    }
  };


  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        const newStatus = !user.isActive;
        await FirestoreService.toggleUserStatus(userId, newStatus);
        setUsers(users.map(u => 
          u.id === userId ? { ...u, isActive: newStatus } : u
        ));
        setFilteredUsers(filteredUsers.map(u => 
          u.id === userId ? { ...u, isActive: newStatus } : u
        ));
        Alert.alert('Éxito', `Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`);
      }
    } catch (error) {
      console.error('Error cambiando estado del usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  const deleteUser = async (userId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await FirestoreService.deleteUser(userId);
              setUsers(users.filter(user => user.id !== userId));
              setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
              Alert.alert('Éxito', 'Usuario eliminado correctamente');
            } catch (error) {
              console.error('Error eliminando usuario:', error);
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          }
        }
      ]
    );
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      badge: user.badge || '',
      department: user.department || ''
    });
    setShowEditUser(true);
  };

  const saveUser = async () => {
    if (!newUser.name || !newUser.lastName || !newUser.email) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      if (editingUser) {
        // Editar usuario existente en Firestore
        await FirestoreService.updateUser(editingUser.id, {
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
          badge: newUser.badge,
          department: newUser.department
        });
        
        // Actualizar estado local
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                name: newUser.name,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                role: newUser.role,
                badge: newUser.badge,
                department: newUser.department
              }
            : user
        ));
        Alert.alert('Éxito', 'Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario en Firestore
        const userData = {
          name: newUser.name,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          role: newUser.role,
          isActive: true,
          badge: newUser.badge,
          department: newUser.department
        };
        
        const userId = await FirestoreService.createUser(userData);
        
        // Actualizar estado local
        const newUserData: User = {
          id: userId,
          ...userData,
          createdAt: new Date()
        };
        setUsers([newUserData, ...users]);
        Alert.alert('Éxito', 'Usuario creado correctamente');
      }

      setShowAddUser(false);
      setShowEditUser(false);
      setEditingUser(null);
      setNewUser({
        name: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'citizen',
        badge: '',
        department: ''
      });
      
      // Recargar usuarios para sincronizar
      loadUsers();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      Alert.alert('Error', 'No se pudo guardar el usuario');
    }
  };

  const resetForm = () => {
    setNewUser({
      name: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: 'citizen',
      badge: '',
      department: ''
    });
    setEditingUser(null);
  };

  const roleOptions = [
    { value: 'citizen', label: 'Ciudadano' },
    { value: 'police_officer', label: 'Oficial de Policía' },
    { value: 'security_guard', label: 'Agente de Seguridad' },
    { value: 'emergency_responder', label: 'Respondedor de Emergencias' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <SecurityIcon name="menu" size={24} color={SecurityColors.text.primary} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.headerTitle}>Gestión de Usuarios</ThemedText>
        <TouchableOpacity 
          onPress={() => {
            resetForm();
            setShowAddUser(true);
          }} 
          style={styles.addButton}
        >
          <SecurityIcon name="add" size={24} color={SecurityColors.background.light} />
        </TouchableOpacity>
      </View>

      {/* Filtros y búsqueda */}
      <View style={styles.filters}>
        <View style={styles.searchContainer}>
          <SecurityIcon name="search" size={20} color={SecurityColors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={SecurityColors.text.secondary}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilters}>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'admin', label: 'Admin' },
            { key: 'police_officer', label: 'Policía' },
            { key: 'citizen', label: 'Ciudadanos' }
          ].map(role => (
            <TouchableOpacity
              key={role.key}
              style={[
                styles.roleFilter,
                filterRole === role.key && styles.roleFilterActive
              ]}
              onPress={() => setFilterRole(role.key)}
            >
              <ThemedText style={[
                styles.roleFilterText,
                filterRole === role.key && styles.roleFilterTextActive
              ]}>
                {role.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de usuarios */}
      <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
        {filteredUsers.map(user => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <SecurityIcon name="person" size={24} color={SecurityColors.text.primary} />
              </View>
              <View style={styles.userDetails}>
                <ThemedText style={styles.userName}>
                  {user.name} {user.lastName}
                </ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                <View style={styles.userMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                    <ThemedText style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                      {getRoleDisplayName(user.role)}
                    </ThemedText>
                  </View>
                  {user.badge && (
                    <View style={styles.badgeContainer}>
                      <SecurityIcon name="shield-checkmark" size={12} color={SecurityColors.trujillo.gold} />
                      <ThemedText style={styles.badgeText}>{user.badge}</ThemedText>
                    </View>
                  )}
                </View>
                {user.department && (
                  <ThemedText style={styles.department}>{user.department}</ThemedText>
                )}
                <ThemedText style={styles.phoneNumber}>{user.phoneNumber}</ThemedText>
              </View>
            </View>
            
            <View style={styles.userActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  user.isActive ? styles.deactivateButton : styles.activateButton
                ]}
                onPress={() => toggleUserStatus(user.id)}
              >
                <SecurityIcon 
                  name={user.isActive ? "pause" : "play"} 
                  size={16} 
                  color={user.isActive ? SecurityColors.status.danger : SecurityColors.status.safe} 
                />
                <ThemedText style={[
                  styles.actionButtonText,
                  { color: user.isActive ? SecurityColors.status.danger : SecurityColors.status.safe }
                ]}>
                  {user.isActive ? 'Desactivar' : 'Activar'}
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => openEditUser(user)}
              >
                <SecurityIcon name="create" size={16} color={SecurityColors.status.info} />
                <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.info }]}>
                  Editar
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => deleteUser(user.id)}
              >
                <SecurityIcon name="trash" size={16} color={SecurityColors.status.danger} />
                <ThemedText style={[styles.actionButtonText, { color: SecurityColors.status.danger }]}>
                  Eliminar
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para agregar/editar usuario */}
      <Modal
        visible={showAddUser || showEditUser}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowAddUser(false);
          setShowEditUser(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
              </ThemedText>
              <TouchableOpacity onPress={() => {
                setShowAddUser(false);
                setShowEditUser(false);
                resetForm();
              }}>
                <SecurityIcon name="close" size={24} color={SecurityColors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <ThemedText style={styles.fieldLabel}>Nombre *</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={newUser.name}
                    onChangeText={(text) => setNewUser({...newUser, name: text})}
                    placeholder="Ingresa el nombre"
                    placeholderTextColor={SecurityColors.text.secondary}
                  />
                </View>
                <View style={styles.formField}>
                  <ThemedText style={styles.fieldLabel}>Apellido *</ThemedText>
                  <TextInput
                    style={styles.textInput}
                    value={newUser.lastName}
                    onChangeText={(text) => setNewUser({...newUser, lastName: text})}
                    placeholder="Ingresa el apellido"
                    placeholderTextColor={SecurityColors.text.secondary}
                  />
                </View>
              </View>

              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Email *</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={newUser.email}
                  onChangeText={(text) => setNewUser({...newUser, email: text})}
                  placeholder="usuario@ejemplo.com"
                  placeholderTextColor={SecurityColors.text.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Teléfono</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={newUser.phoneNumber}
                  onChangeText={(text) => setNewUser({...newUser, phoneNumber: text})}
                  placeholder="+51999999999"
                  placeholderTextColor={SecurityColors.text.secondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formField}>
                <ThemedText style={styles.fieldLabel}>Rol *</ThemedText>
                <View style={styles.pickerContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {roleOptions.map(role => (
                      <TouchableOpacity
                        key={role.value}
                        style={[
                          styles.roleOption,
                          newUser.role === role.value && styles.roleOptionActive
                        ]}
                        onPress={() => setNewUser({...newUser, role: role.value})}
                      >
                        <ThemedText style={[
                          styles.roleOptionText,
                          newUser.role === role.value && styles.roleOptionTextActive
                        ]}>
                          {role.label}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {(newUser.role === 'police_officer' || newUser.role === 'security_guard' || newUser.role === 'admin') && (
                <>
                  <View style={styles.formField}>
                    <ThemedText style={styles.fieldLabel}>Placa/Identificación</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={newUser.badge}
                      onChangeText={(text) => setNewUser({...newUser, badge: text})}
                      placeholder="POL001, SEC001, etc."
                      placeholderTextColor={SecurityColors.text.secondary}
                    />
                  </View>

                  <View style={styles.formField}>
                    <ThemedText style={styles.fieldLabel}>Departamento</ThemedText>
                    <TextInput
                      style={styles.textInput}
                      value={newUser.department}
                      onChangeText={(text) => setNewUser({...newUser, department: text})}
                      placeholder="Policía Nacional, Seguridad Privada, etc."
                      placeholderTextColor={SecurityColors.text.secondary}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddUser(false);
                  setShowEditUser(false);
                  resetForm();
                }}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveUser}
              >
                <ThemedText style={styles.saveButtonText}>
                  {editingUser ? 'Actualizar' : 'Crear'}
                </ThemedText>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: SecurityColors.background.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  addButton: {
    backgroundColor: SecurityColors.status.info,
    padding: 8,
    borderRadius: 20,
  },
  filters: {
    padding: 20,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: SecurityColors.text.primary,
  },
  roleFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  roleFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SecurityColors.background.card,
    borderRadius: 20,
  },
  roleFilterActive: {
    backgroundColor: SecurityColors.status.info,
  },
  roleFilterText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  roleFilterTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  userList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: SecurityColors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SecurityColors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: SecurityColors.trujillo.gold,
    fontWeight: '600',
  },
  department: {
    fontSize: 12,
    color: SecurityColors.text.muted,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 12,
    color: SecurityColors.text.muted,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  activateButton: {
    backgroundColor: SecurityColors.status.safe + '20',
  },
  deactivateButton: {
    backgroundColor: SecurityColors.status.danger + '20',
  },
  editButton: {
    backgroundColor: SecurityColors.status.info + '20',
  },
  deleteButton: {
    backgroundColor: SecurityColors.status.danger + '20',
  },
  actionButtonText: {
    fontSize: 12,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
  },
  modalForm: {
    maxHeight: 400,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formField: {
    marginBottom: 16,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 8,
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
  pickerContainer: {
    marginTop: 8,
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 20,
    marginRight: 8,
  },
  roleOptionActive: {
    backgroundColor: SecurityColors.status.info,
  },
  roleOptionText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
  },
  roleOptionTextActive: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  saveButton: {
    flex: 1,
    backgroundColor: SecurityColors.status.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
  },
});