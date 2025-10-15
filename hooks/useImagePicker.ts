import { ImageUploadResult, StorageService } from '@/services/storage.service';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Platform } from 'react-native';

export interface ImageData {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface UseImagePickerReturn {
  images: ImageData[];
  loading: boolean;
  pickImage: () => Promise<void>;
  pickMultipleImages: () => Promise<void>;
  removeImage: (index: number) => void;
  uploadImages: (folder?: string) => Promise<ImageUploadResult[]>;
  clearImages: () => void;
}

export function useImagePicker(): UseImagePickerReturn {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos acceso a tu galería para seleccionar imágenes.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async (): Promise<void> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newImage: ImageData = {
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize,
        };
        
        setImages(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const pickMultipleImages = async (): Promise<void> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5, // Máximo 5 imágenes
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages: ImageData[] = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg',
          size: asset.fileSize,
        }));
        
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking multiple images:', error);
      Alert.alert('Error', 'No se pudieron seleccionar las imágenes');
    }
  };

  const removeImage = (index: number): void => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (folder: string = 'imagenes_reportes'): Promise<ImageUploadResult[]> => {
    if (images.length === 0) {
      return [];
    }

    try {
      setLoading(true);
      
      // Convertir URIs a Blobs para subir
      const uploadPromises = images.map(async (image) => {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        return StorageService.uploadImage(blob, folder, image.name);
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error('Error al subir las imágenes');
    } finally {
      setLoading(false);
    }
  };

  const clearImages = (): void => {
    setImages([]);
  };

  return {
    images,
    loading,
    pickImage,
    pickMultipleImages,
    removeImage,
    uploadImages,
    clearImages,
  };
}



