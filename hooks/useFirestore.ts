import { db } from '@/firebase.config';
import { FirestoreService } from '@/services/firestore.service';
import {
    collection,
    DocumentData,
    onSnapshot,
    query,
    QueryConstraint,
    Unsubscribe
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Hook para obtener documentos en tiempo real
export function useFirestoreCollection<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    const setupListener = async () => {
      try {
        const q = query(collection(db, collectionName), ...constraints);
        
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const documents = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as T[];
            
            setData(documents);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error en listener de Firestore:', err);
            setError('Error al obtener los datos en tiempo real');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error configurando listener:', err);
        setError('Error al configurar la conexión en tiempo real');
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Hook para obtener un documento específico en tiempo real
export function useFirestoreDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setData(null);
      setLoading(false);
      return;
    }

    let unsubscribe: Unsubscribe;

    const setupListener = async () => {
      try {
        const docRef = collection(db, collectionName).doc(documentId);
        
        unsubscribe = onSnapshot(
          docRef,
          (doc) => {
            if (doc.exists()) {
              setData({ id: doc.id, ...doc.data() } as T);
            } else {
              setData(null);
            }
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error en listener de documento:', err);
            setError('Error al obtener el documento en tiempo real');
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error configurando listener de documento:', err);
        setError('Error al configurar la conexión del documento');
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [collectionName, documentId]);

  return { data, loading, error };
}

// Hook para operaciones CRUD con estado de carga
export function useFirestoreOperations<T extends DocumentData>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const id = await FirestoreService.createDocument(collectionName, data);
      setLoading(false);
      return id;
    } catch (err: any) {
      setError(err.message || 'Error al crear el documento');
      setLoading(false);
      return null;
    }
  };

  const update = async (id: string, data: Partial<T>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await FirestoreService.updateDocument(collectionName, id, data);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el documento');
      setLoading(false);
      return false;
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await FirestoreService.deleteDocument(collectionName, id);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el documento');
      setLoading(false);
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    create,
    update,
    remove,
    loading,
    error,
    clearError
  };
}














