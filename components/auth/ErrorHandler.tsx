import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorHandlerProps {
  error: string | null;
  onClear: () => void;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ error, onClear }) => {
  if (!error) return null;

  const getErrorMessage = (error: string) => {
    if (error.includes('email-already-in-use')) {
      return {
        title: 'Email ya registrado',
        message: 'Este email ya está en uso. ¿Ya tienes cuenta? Inicia sesión en su lugar.',
        action: 'Ir a Login'
      };
    }
    if (error.includes('user-not-found')) {
      return {
        title: 'Usuario no encontrado',
        message: 'No existe una cuenta con este email. Verifica el email o regístrate.',
        action: 'Registrarse'
      };
    }
    if (error.includes('wrong-password')) {
      return {
        title: 'Contraseña incorrecta',
        message: 'La contraseña no es correcta. Intenta nuevamente.',
        action: 'Reintentar'
      };
    }
    if (error.includes('weak-password')) {
      return {
        title: 'Contraseña muy débil',
        message: 'La contraseña debe tener al menos 6 caracteres.',
        action: 'Cambiar contraseña'
      };
    }
    return {
      title: 'Error',
      message: error,
      action: 'Cerrar'
    };
  };

  const errorInfo = getErrorMessage(error);

  return (
    <View style={styles.container}>
      <View style={styles.errorBox}>
        <Text style={styles.errorTitle}>{errorInfo.title}</Text>
        <Text style={styles.errorMessage}>{errorInfo.message}</Text>
        <Text style={styles.errorAction} onPress={onClear}>
          {errorInfo.action}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  errorTitle: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorMessage: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 8,
  },
  errorAction: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default ErrorHandler;

