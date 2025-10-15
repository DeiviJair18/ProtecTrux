import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { TrujilloBackground } from '@/components/auth/TrujilloBackground';
import { ThemedText } from '@/components/themed-text';
import { ProtecTruxConfig } from '@/constants/protectrux';
import { SecurityColors } from '@/constants/security-colors';

export default function LoginScreen() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchToRegister = () => setIsLoginMode(false);
  const switchToLogin = () => setIsLoginMode(true);

  return (
    <TrujilloBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Header con logo y título */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoBackground}>
                    <SecurityIcon
                      name="shield-checkmark"
                      size={70}
                      color={SecurityColors.trujillo.gold}
                    />
                  </View>
                </View>
                
                <ThemedText style={styles.title}>{ProtecTruxConfig.appName}</ThemedText>
                <ThemedText style={styles.subtitle}>
                  {ProtecTruxConfig.tagline}
                </ThemedText>
                
                <View style={styles.badgeContainer}>
                  <SecurityIcon name="location" size={14} color={SecurityColors.trujillo.gold} />
                  <ThemedText style={styles.location}>{ProtecTruxConfig.location}</ThemedText>
                </View>
              </View>

              {/* Formulario dinámico - Login o Registro */}
              {isLoginMode ? (
                <LoginForm onSwitchToRegister={switchToRegister} />
              ) : (
                <RegisterForm onSwitchToLogin={switchToLogin} />
              )}

              {/* Footer con información de emergencia - Solo en modo login */}
              {isLoginMode && (
                <View style={styles.footer}>
                  <View style={styles.emergencyContainer}>
                    <SecurityIcon name="call" size={16} color={SecurityColors.status.danger} />
                    <ThemedText style={styles.emergencyText}>
                      Emergencias: {ProtecTruxConfig.emergency.police} | Serenazgo: {ProtecTruxConfig.emergency.serenazgo}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.patrimonioContainer}>
                    <SecurityIcon name="heart" size={14} color={SecurityColors.trujillo.gold} />
                    <ThemedText style={styles.patrimonioText}>
                      Protegiendo el Patrimonio Cultural de la Humanidad
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TrujilloBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: SecurityColors.trujillo.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: SecurityColors.trujillo.gold,
  },
  location: {
    fontSize: 12,
    color: SecurityColors.trujillo.gold,
    fontWeight: '600',
  },
  footer: {
    gap: 12,
    marginTop: 20,
  },
  emergencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  emergencyText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  patrimonioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center',
  },
  patrimonioText: {
    fontSize: 11,
    color: SecurityColors.trujillo.gold,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
