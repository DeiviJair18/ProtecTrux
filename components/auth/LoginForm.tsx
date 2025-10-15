import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SecurityButton } from './SecurityButton';
import { SecurityIcon } from './SecurityIcon';
import { SecurityInput } from './SecurityInput';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login, isLoading, error, clearError } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');
    clearError();

    // Validaciones
    let hasErrors = false;

    if (!email) {
      setEmailError('El email es requerido');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Ingrese un email válido');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      await login({ email, password });
      // Si el login es exitoso, navegar a la pantalla principal
      router.replace('/(tabs)');
    } catch (error) {
      // El error se maneja en el contexto
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formHeader}>
        <SecurityIcon name="log-in" size={24} color={SecurityColors.trujillo.gold} />
        <ThemedText style={styles.formTitle}>Acceso al Sistema</ThemedText>
      </View>
      
      <SecurityInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="ejemplo@correo.com"
        iconName="mail"
        keyboardType="email-address"
        error={emailError}
        autoCapitalize="none"
      />

      <SecurityInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="Ingrese su contraseña"
        iconName="lock-closed"
        secureTextEntry
        error={passwordError}
      />

      {error && (
        <View style={styles.errorContainer}>
          <SecurityIcon name="alert-circle" size={16} color={SecurityColors.status.danger} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <SecurityButton
        title="Ingresar al Sistema"
        onPress={handleLogin}
        iconName="log-in"
        loading={isLoading}
        style={styles.loginButton}
      />

      <SecurityButton
        title="¿Olvidó su contraseña?"
        onPress={() => {/* TODO: Implementar recuperación */}}
        variant="secondary"
        size="small"
        style={styles.forgotButton}
      />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <ThemedText style={styles.dividerText}>o</ThemedText>
        <View style={styles.dividerLine} />
      </View>

      <SecurityButton
        title="¿No tienes cuenta? Regístrate"
        onPress={onSwitchToRegister}
        variant="outline"
        iconName="person-add"
        style={styles.registerButton}
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
  loginButton: {
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 12,
  },
  forgotButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: SecurityColors.text.secondary + '30',
  },
  dividerText: {
    marginHorizontal: 16,
    color: SecurityColors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  registerButton: {
    borderRadius: 12,
  },
});


