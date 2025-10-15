import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CitizenPanicButtonProps {
  onBack: () => void;
}

export function CitizenPanicButton({ onBack }: CitizenPanicButtonProps) {
  const [countdown, setCountdown] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCalling(true);
            makeEmergencyCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, countdown]);

  const startPanicSequence = () => {
    setIsActive(true);
    setCountdown(5);
  };

  const cancelPanic = () => {
    setIsActive(false);
    setCountdown(5);
    setIsCalling(false);
  };

  const makeEmergencyCall = async () => {
    try {
      const phoneNumber = '920772139';
      const phoneUrl = `tel:${phoneNumber}`;
      
      console.log('🚨 Realizando llamada de emergencia al:', phoneNumber);
      
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) {
        await Linking.openURL(phoneUrl);
        console.log('✅ Llamada iniciada exitosamente');
      } else {
        console.error('❌ No se puede realizar la llamada');
        Alert.alert(
          'Error',
          'No se puede realizar la llamada de emergencia. Por favor, llama manualmente al 920772139',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      console.error('❌ Error realizando llamada de emergencia:', error);
      Alert.alert(
        'Error',
        'No se pudo realizar la llamada automática. Por favor, llama manualmente al 920772139',
        [{ text: 'Entendido' }]
      );
    }
  };

  const getCountdownColor = () => {
    if (countdown > 3) return SecurityColors.status.safe;
    if (countdown > 1) return SecurityColors.status.warning;
    return SecurityColors.status.danger;
  };

  const getStatusText = () => {
    if (isCalling) return 'Llamando...';
    if (isActive) return 'Cancelar en';
    return 'Iniciar Secuencia de Pánico';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Botón de Pánico</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Emergency Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.emergencyIcon, { backgroundColor: getCountdownColor() + '20' }]}>
            <SecurityIcon 
              name="warning" 
              size={80} 
              color={isActive ? getCountdownColor() : SecurityColors.status.danger} 
            />
          </View>
        </View>

        {/* Status Text */}
        <ThemedText style={styles.statusTitle}>
          {isCalling ? '🚨 LLAMANDO A EMERGENCIA 🚨' : 'Botón de Pánico Activo'}
        </ThemedText>

        <ThemedText style={styles.statusDescription}>
          {isCalling 
            ? 'Se está realizando la llamada de emergencia al número 920772139'
            : isActive 
              ? 'La llamada de emergencia se realizará automáticamente en:'
              : 'Presiona el botón para iniciar la secuencia de pánico. Tendrás 5 segundos para cancelar.'
          }
        </ThemedText>

        {/* Countdown Display */}
        {isActive && (
          <View style={styles.countdownContainer}>
            <View style={[styles.countdownCircle, { borderColor: getCountdownColor() }]}>
              <ThemedText style={[styles.countdownText, { color: getCountdownColor() }]}>
                {countdown}
              </ThemedText>
            </View>
            <ThemedText style={styles.countdownLabel}>segundos</ThemedText>
          </View>
        )}

        {/* Call Status */}
        {isCalling && (
          <View style={styles.callingContainer}>
            <View style={styles.callingAnimation}>
              <SecurityIcon name="call" size={40} color={SecurityColors.status.danger} />
            </View>
            <ThemedText style={styles.callingText}>
              Llamando al 920772139...
            </ThemedText>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isCalling && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                isActive ? styles.cancelButton : styles.panicButton
              ]}
              onPress={isActive ? cancelPanic : startPanicSequence}
            >
              <SecurityIcon 
                name={isActive ? "close" : "warning"} 
                size={24} 
                color={SecurityColors.background.light} 
              />
              <ThemedText style={styles.buttonText}>
                {getStatusText()}
              </ThemedText>
            </TouchableOpacity>
          )}

          {isCalling && (
            <TouchableOpacity
              style={[styles.actionButton, styles.endCallButton]}
              onPress={cancelPanic}
            >
              <SecurityIcon name="close" size={24} color={SecurityColors.background.light} />
              <ThemedText style={styles.buttonText}>
                Finalizar Llamada
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Emergency Info */}
        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoTitle}>Información de Emergencia</ThemedText>
          <ThemedText style={styles.infoText}>
            • Número de emergencia: 920772139
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • El botón de pánico te conecta directamente con servicios de emergencia
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Tienes 5 segundos para cancelar antes de que se realice la llamada
          </ThemedText>
        </View>
      </View>
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  emergencyIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: SecurityColors.status.danger,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SecurityColors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  statusDescription: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  countdownCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  countdownLabel: {
    fontSize: 16,
    color: SecurityColors.text.secondary,
  },
  callingContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  callingAnimation: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SecurityColors.status.danger + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  callingText: {
    fontSize: 18,
    color: SecurityColors.status.danger,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
  },
  panicButton: {
    backgroundColor: SecurityColors.status.danger,
  },
  cancelButton: {
    backgroundColor: SecurityColors.status.warning,
  },
  endCallButton: {
    backgroundColor: SecurityColors.text.secondary,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SecurityColors.background.light,
  },
  infoContainer: {
    backgroundColor: SecurityColors.background.card,
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: SecurityColors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
});
