import { SecurityColors } from '@/constants/security-colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

interface TrujilloBackgroundProps {
  children: React.ReactNode;
}

export const TrujilloBackground: React.FC<TrujilloBackgroundProps> = ({ children }) => {
  // Intenta cargar la imagen, si no existe usa un gradiente
  const TrujilloImage = () => {
    try {
      return (
        <ImageBackground
          source={require('@/assets/images/trujillo1.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              'rgba(30, 58, 138, 0.85)',  // Azul policía con transparencia
              'rgba(0, 0, 0, 0.75)',      // Negro con transparencia
              'rgba(30, 58, 138, 0.9)'    // Azul policía más intenso
            ]}
            style={styles.gradient}
          >
            {children}
          </LinearGradient>
        </ImageBackground>
      );
    } catch (error) {
      // Si la imagen no existe, usa un gradiente fallback
      return (
        <LinearGradient
          colors={[
            SecurityColors.primary.blue,
            SecurityColors.trujillo.heritage,
            SecurityColors.trujillo.ocean,
            SecurityColors.primary.blue
          ]}
          style={styles.fallbackGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      );
    }
  };

  return <TrujilloImage />;
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  fallbackGradient: {
    flex: 1,
  },
});

















