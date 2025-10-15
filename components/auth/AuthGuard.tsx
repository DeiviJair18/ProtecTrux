import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useAuth } from '@/hooks/auth/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SecurityIcon } from './SecurityIcon';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SecurityIcon
          name="shield-checkmark"
          size={60}
          color={SecurityColors.primary.blue}
        />
        <ThemedText style={styles.loadingText}>
          Verificando credenciales...
        </ThemedText>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.light,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
  },
});
