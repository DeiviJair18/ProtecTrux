import { auth } from '@/firebase.config';
import { User } from '@/types/auth';
import {
    createUserWithEmailAndPassword,
    deleteUser as deleteFirebaseUser,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword
} from 'firebase/auth';
import { FirestoreService } from './firestore.service';

export class AuthService {
  
  // Registrar nuevo usuario
  static async registerUser(
    email: string, 
    password: string, 
    userData: Omit<User, 'id' | 'email' | 'createdAt'>
  ): Promise<User> {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Crear perfil de usuario en Firestore
      const userProfile: Omit<User, 'id' | 'createdAt'> = {
        ...userData,
        email,
        isActive: true
      };
      
      const userId = await FirestoreService.createUser(userProfile);
      
      return {
        id: userId,
        ...userProfile,
        createdAt: new Date()
      };
      
    } catch (error: any) {
      console.error('Error registrando usuario:', error);
      
      let errorMessage = 'Error al registrar el usuario';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El email ya está en uso';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      throw new Error(errorMessage);
    }
  }

  // Enviar email de recuperación de contraseña
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Error enviando email de recuperación:', error);
      
      let errorMessage = 'Error al enviar el email de recuperación';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuario no encontrado';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      throw new Error(errorMessage);
    }
  }

  // Actualizar contraseña del usuario actual
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado');
      }
      
      await updatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      console.error('Error actualizando contraseña:', error);
      
      let errorMessage = 'Error al actualizar la contraseña';
      if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Necesita volver a iniciar sesión para cambiar la contraseña';
      }
      
      throw new Error(errorMessage);
    }
  }

  // Actualizar email del usuario actual
  static async updateUserEmail(newEmail: string, userId: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Actualizar en Firebase Auth
      await updateEmail(auth.currentUser, newEmail);
      
      // Actualizar en Firestore
      await FirestoreService.updateUser(userId, { email: newEmail });
      
    } catch (error: any) {
      console.error('Error actualizando email:', error);
      
      let errorMessage = 'Error al actualizar el email';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El email ya está en uso';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Necesita volver a iniciar sesión para cambiar el email';
      }
      
      throw new Error(errorMessage);
    }
  }

  // Desactivar usuario (soft delete)
  static async deactivateUser(userId: string): Promise<void> {
    try {
      await FirestoreService.updateUser(userId, { 
        isActive: false,
        deactivatedAt: new Date()
      });
    } catch (error) {
      console.error('Error desactivando usuario:', error);
      throw new Error('Error al desactivar el usuario');
    }
  }

  // Activar usuario
  static async activateUser(userId: string): Promise<void> {
    try {
      await FirestoreService.updateUser(userId, { 
        isActive: true,
        deactivatedAt: null
      });
    } catch (error) {
      console.error('Error activando usuario:', error);
      throw new Error('Error al activar el usuario');
    }
  }

  // Eliminar usuario completamente
  static async deleteUser(userId: string): Promise<void> {
    try {
      // Primero eliminar de Firestore
      await FirestoreService.deleteDocument('users', userId);
      
      // Luego eliminar de Firebase Auth (solo si es el usuario actual)
      if (auth.currentUser) {
        await deleteFirebaseUser(auth.currentUser);
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw new Error('Error al eliminar el usuario');
    }
  }

  // Obtener perfil del usuario actual
  static async getCurrentUserProfile(): Promise<User | null> {
    try {
      if (!auth.currentUser) {
        return null;
      }
      
      return await FirestoreService.getUserByEmail(auth.currentUser.email!);
    } catch (error) {
      console.error('Error obteniendo perfil del usuario:', error);
      return null;
    }
  }

  // Actualizar perfil del usuario
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      // Remover campos que no se deben actualizar directamente
      const { id, email, createdAt, ...updateData } = updates as any;
      
      await FirestoreService.updateUser(userId, updateData);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw new Error('Error al actualizar el perfil');
    }
  }
}














