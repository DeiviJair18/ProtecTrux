import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { useEffect, useState } from 'react';
import { Alert, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CitizenPoliceCallProps {
  onBack: () => void;
}

export function CitizenPoliceCall({ onBack }: CitizenPoliceCallProps) {
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
            makePoliceCall();
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

  const startPoliceCallSequence = () => {
    setIsActive(true);
    setCountdown(5);
  };

  const cancelPoliceCall = () => {
    setIsActive(false);
    setCountdown(5);
    setIsCalling(false);
  };

  const makePoliceCall = async () => {
    try {
      const phoneNumber = '920772139';
      const phoneUrl = `tel:${phoneNumber}`;
      
      console.log('🚔 Llamando a policía:', phoneNumber);
      
      const canCall = await Linking.canOpenURL(phoneUrl);
      if (canCall) {
        await Linking.openURL(phoneUrl);
        console.log('✅ Llamada a policía iniciada exitosamente');
      } else {
        console.error('❌ No se puede realizar la llamada');
        Alert.alert(
          'Error',
          'No se puede realizar la llamada a policía. Por favor, llama manualmente al 920772139',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      console.error('❌ Error realizando llamada a policía:', error);
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
    return 'Llamar a Policía';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <SecurityIcon name="arrow-back" size={24} color={SecurityColors.text.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Llamar a Policía</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* Police Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.policeIcon, { backgroundColor: getCountdownColor() + '20' }]}>
            <SecurityIcon 
              name="call" 
              size={80} 
              color={isActive ? getCountdownColor() : SecurityColors.status.danger} 
            />
          </View>
        </View>

        {/* Status Text */}
        <ThemedText style={styles.statusTitle}>
          {isCalling ? '🚔 LLAMANDO A POLICÍA 🚔' : 'Llamada a Policía'}
        </ThemedText>

        <ThemedText style={styles.statusDescription}>
          {isCalling 
            ? 'Se está realizando la llamada a policía al número 920772139'
            : isActive 
              ? 'La llamada a policía se realizará automáticamente en:'
              : 'Presiona el botón para iniciar la llamada a policía. Tendrás 5 segundos para cancelar.'
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
                isActive ? styles.cancelButton : styles.policeButton
              ]}
              onPress={isActive ? cancelPoliceCall : startPoliceCallSequence}
            >
              <SecurityIcon 
                name={isActive ? "close" : "call"} 
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
              onPress={cancelPoliceCall}
            >
              <SecurityIcon name="close" size={24} color={SecurityColors.background.light} />
              <ThemedText style={styles.buttonText}>
                Finalizar Llamada
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Police Info */}
        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoTitle}>Información de Policía</ThemedText>
          <ThemedText style={styles.infoText}>
            • Número de policía: 920772139
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • La llamada a policía te conecta directamente con servicios de seguridad
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Tienes 5 segundos para cancelar antes de que se realice la llamada
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Usa este servicio para reportar delitos, emergencias o solicitar ayuda policial
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
  policeIcon: {
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
  policeButton: {
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
