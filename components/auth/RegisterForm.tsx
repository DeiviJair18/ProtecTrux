import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SecurityButton } from './SecurityButton';
import { SecurityIcon } from './SecurityIcon';
import { SecurityInput } from './SecurityInput';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  const { register, isLoading, error, clearError } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    // Validar formato peruano: 9 dígitos que empiecen con 9
    const phoneRegex = /^9\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    };

    let hasErrors = false;

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
      hasErrors = true;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      hasErrors = true;
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
      hasErrors = true;
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
      hasErrors = true;
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
      hasErrors = true;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      hasErrors = true;
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme su contraseña';
      hasErrors = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      hasErrors = true;
    }

    // Validar número de teléfono
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'El número de celular es requerido';
      hasErrors = true;
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Ingrese un número válido (9 dígitos, ej: 987654321)';
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleRegister = async () => {
    // Limpiar errores previos
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber.trim()
      });

      // Si el registro es exitoso, mostrar mensaje y navegar
      Alert.alert(
        'Registro Exitoso',
        'Su cuenta ha sido creada correctamente. Bienvenido a SecureTrux.',
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      // El error se maneja en el contexto
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <SecurityIcon name="person-add" size={24} color={SecurityColors.trujillo.gold} />
        <ThemedText style={styles.formTitle}>Crear Cuenta</ThemedText>
      </View>

      <SecurityInput
        label="Nombre"
        value={formData.name}
        onChangeText={(value) => updateField('name', value)}
        placeholder="Ingrese su nombre"
        iconName="person"
        error={errors.name}
        autoCapitalize="words"
      />

      <SecurityInput
        label="Apellido"
        value={formData.lastName}
        onChangeText={(value) => updateField('lastName', value)}
        placeholder="Ingrese su apellido"
        iconName="person"
        error={errors.lastName}
        autoCapitalize="words"
      />

      <SecurityInput
        label="Correo Electrónico"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="ejemplo@correo.com"
        iconName="mail"
        keyboardType="email-address"
        error={errors.email}
        autoCapitalize="none"
      />

      <SecurityInput
        label="Número de Celular"
        value={formData.phoneNumber}
        onChangeText={(value) => updateField('phoneNumber', value)}
        placeholder="987654321"
        iconName="call"
        keyboardType="numeric"
        error={errors.phoneNumber}
        maxLength={9}
      />

      <SecurityInput
        label="Contraseña"
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        placeholder="Mínimo 6 caracteres"
        iconName="lock-closed"
        secureTextEntry
        error={errors.password}
      />

      <SecurityInput
        label="Confirmar Contraseña"
        value={formData.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        placeholder="Repita su contraseña"
        iconName="lock-closed"
        secureTextEntry
        error={errors.confirmPassword}
      />

      {error && (
        <View style={styles.errorContainer}>
          <SecurityIcon name="alert-circle" size={16} color={SecurityColors.status.danger} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <SecurityButton
        title="Crear Cuenta"
        onPress={handleRegister}
        iconName="person-add"
        loading={isLoading}
        style={styles.registerButton}
      />

      <SecurityButton
        title="¿Ya tienes cuenta? Iniciar Sesión"
        onPress={onSwitchToLogin}
        variant="secondary"
        size="small"
        style={styles.switchButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: SecurityColors.status.danger + '15',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SecurityColors.status.danger + '30',
  },
  errorText: {
    color: SecurityColors.status.danger,
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  registerButton: {
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 12,
  },
  switchButton: {
    alignSelf: 'center',
  },
});














