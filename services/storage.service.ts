import { storage } from '@/firebase.config';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export interface ImageUploadResult {
  url: string;
  path: string;
}

export class StorageService {
  private static storage = storage;

  /**
   * Sube una imagen a Firebase Storage
   * @param file - Archivo de imagen (URI o Blob)
   * @param folder - Carpeta donde guardar (ej: 'imagenes_reportes')
   * @param fileName - Nombre del archivo (opcional, se genera automáticamente si no se proporciona)
   * @returns Promise con la URL de descarga y la ruta del archivo
   */
  static async uploadImage(
    file: string | Blob,
    folder: string = 'imagenes_reportes',
    fileName?: string
  ): Promise<ImageUploadResult> {
    try {
      // Generar nombre único si no se proporciona
      const finalFileName = fileName || `image_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      const filePath = `${folder}/${finalFileName}`;
      
      // Crear referencia al archivo
      const fileRef = ref(this.storage, filePath);
      
      // Convertir URI a Blob si es necesario
      let fileBlob: Blob;
      if (typeof file === 'string') {
        // Si es una URI, convertir a Blob
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Error fetching image: ${response.status}`);
        }
        fileBlob = await response.blob();
      } else {
        fileBlob = file;
      }
      
      // Subir el archivo
      const snapshot = await uploadBytes(fileRef, fileBlob);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: filePath
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      
      // Detectar errores específicos de CORS
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('cors')) {
          throw new Error('CORS_ERROR: Error de CORS al subir imagen');
        }
        if (error.message.includes('network') || error.message.includes('Network')) {
          throw new Error('NETWORK_ERROR: Error de red al subir imagen');
        }
        if (error.message.includes('permission') || error.message.includes('Permission')) {
          throw new Error('PERMISSION_ERROR: Sin permisos para subir imagen');
        }
      }
      
      throw new Error('Error al subir la imagen');
    }
  }

  /**
   * Sube múltiples imágenes
   * @param files - Array de archivos de imagen
   * @param folder - Carpeta donde guardar
   * @returns Promise con array de URLs y rutas
   */
  static async uploadMultipleImages(
    files: (string | Blob)[],
    folder: string = 'imagenes_reportes'
  ): Promise<ImageUploadResult[]> {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadImage(file, folder, `image_${Date.now()}_${index}`)
      );
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Error al subir las imágenes');
    }
  }

  /**
   * Elimina una imagen de Firebase Storage
   * @param imagePath - Ruta de la imagen en Storage
   */
  static async deleteImage(imagePath: string): Promise<void> {
    try {
      const imageRef = ref(this.storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  /**
   * Elimina múltiples imágenes
   * @param imagePaths - Array de rutas de imágenes
   */
  static async deleteMultipleImages(imagePaths: string[]): Promise<void> {
    try {
      const deletePromises = imagePaths.map(path => this.deleteImage(path));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      throw new Error('Error al eliminar las imágenes');
    }
  }

  /**
   * Obtiene la URL de descarga de una imagen
   * @param imagePath - Ruta de la imagen en Storage
   * @returns URL de descarga
   */
  static async getImageURL(imagePath: string): Promise<string> {
    try {
      const imageRef = ref(this.storage, imagePath);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error getting image URL:', error);
      throw new Error('Error al obtener la URL de la imagen');
    }
  }
}



