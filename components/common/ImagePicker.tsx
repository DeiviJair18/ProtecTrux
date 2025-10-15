import { SecurityIcon } from '@/components/auth/SecurityIcon';
import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import { ImageData, useImagePicker } from '@/hooks/useImagePicker';
import React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface ImagePickerProps {
  onImagesChange?: (images: ImageData[]) => void;
  maxImages?: number;
  showPreview?: boolean;
}

export function ImagePickerComponent({ 
  onImagesChange, 
  maxImages = 5, 
  showPreview = true 
}: ImagePickerProps) {
  const {
    images,
    loading,
    pickImage,
    pickMultipleImages,
    removeImage,
    clearImages,
  } = useImagePicker();

  // Notificar cambios a los padres
  React.useEffect(() => {
    onImagesChange?.(images);
  }, [images, onImagesChange]);

  const handlePickSingle = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Límite alcanzado', `Solo puedes seleccionar hasta ${maxImages} imágenes`);
      return;
    }
    await pickImage();
  };

  const handlePickMultiple = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Límite alcanzado', `Solo puedes seleccionar hasta ${maxImages} imágenes`);
      return;
    }
    await pickMultipleImages();
  };

  const handleRemoveImage = (index: number) => {
    Alert.alert(
      'Eliminar imagen',
      '¿Estás seguro de que deseas eliminar esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => removeImage(index)
        }
      ]
    );
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <View style={styles.container}>
      {/* Botones de selección */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handlePickSingle}
          disabled={loading || images.length >= maxImages}
        >
          <SecurityIcon name="camera" size={20} color={SecurityColors.background.light} />
          <ThemedText style={styles.buttonText}>Agregar Imagen</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handlePickMultiple}
          disabled={loading || images.length >= maxImages}
        >
          <SecurityIcon name="images" size={20} color={SecurityColors.primary} />
          <ThemedText style={[styles.buttonText, styles.secondaryButtonText]}>
            Múltiples
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Contador de imágenes */}
      <View style={styles.counterContainer}>
        <ThemedText style={styles.counterText}>
          {images.length} / {maxImages} imágenes
        </ThemedText>
        {images.length > 0 && (
          <TouchableOpacity onPress={clearImages} style={styles.clearButton}>
            <ThemedText style={styles.clearButtonText}>Limpiar todo</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Preview de imágenes */}
      {showPreview && images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.previewContainer}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(index)}
              >
                <SecurityIcon name="close" size={16} color={SecurityColors.background.light} />
              </TouchableOpacity>
              <View style={styles.imageInfo}>
                <ThemedText style={styles.imageName} numberOfLines={1}>
                  {image.name}
                </ThemedText>
                <ThemedText style={styles.imageSize}>
                  {formatFileSize(image.size)}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Estado de carga */}
      {loading && (
        <View style={styles.loadingContainer}>
          <SecurityIcon name="refresh" size={20} color={SecurityColors.primary} />
          <ThemedText style={styles.loadingText}>Procesando imágenes...</ThemedText>
        </View>
      )}

      {/* Mensaje de ayuda */}
      {images.length === 0 && (
        <View style={styles.helpContainer}>
          <SecurityIcon name="info" size={20} color={SecurityColors.text.secondary} />
          <ThemedText style={styles.helpText}>
            Selecciona imágenes del incidente para proporcionar más detalles
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: SecurityColors.primary,
  },
  secondaryButton: {
    backgroundColor: SecurityColors.background.light,
    borderWidth: 1,
    borderColor: SecurityColors.primary,
  },
  buttonText: {
    color: SecurityColors.background.light,
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: SecurityColors.primary,
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    color: SecurityColors.text.secondary,
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    fontSize: 12,
    color: SecurityColors.danger,
    fontWeight: '500',
  },
  previewContainer: {
    marginTop: 8,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
    width: 120,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: SecurityColors.background.light,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: SecurityColors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  imageName: {
    fontSize: 12,
    color: SecurityColors.text.primary,
    fontWeight: '500',
  },
  imageSize: {
    fontSize: 10,
    color: SecurityColors.text.secondary,
    marginTop: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: SecurityColors.primary,
    fontWeight: '500',
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: SecurityColors.background.light,
    borderRadius: 8,
    gap: 8,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: SecurityColors.text.secondary,
    lineHeight: 20,
  },
});







