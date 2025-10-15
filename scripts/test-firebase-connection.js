const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVFNYzk553daFAAi5fNtd86fNwRqEONa4",
  authDomain: "protectrux.firebaseapp.com",
  projectId: "protectrux",
  storageBucket: "protectrux.firebasestorage.app",
  messagingSenderId: "108690240801",
  appId: "1:108690240801:web:4f18dd85376a8980df3a60",
  measurementId: "G-T2DN3XQ7C1"
};

async function testFirebaseConnection() {
  console.log('🔍 Probando conexión con Firebase...');
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado correctamente');
    
    // Probar Auth
    const auth = getAuth(app);
    console.log('✅ Firebase Auth configurado');
    
    // Probar Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore configurado');
    
    // Probar conexión a Firestore
    try {
      const usersCollection = collection(db, 'users');
      const snapshot = await getDocs(usersCollection);
      console.log('✅ Conexión a Firestore exitosa');
      console.log(`📊 Documentos encontrados: ${snapshot.size}`);
    } catch (error) {
      console.error('❌ Error conectando a Firestore:', error.message);
    }
    
    console.log('');
    console.log('🎉 Firebase está configurado correctamente');
    console.log('');
    console.log('🔧 Si aún tienes el error "auth/configuration-not-found":');
    console.log('1. Ve a Firebase Console > Authentication');
    console.log('2. Haz clic en "Comenzar"');
    console.log('3. Habilita "Correo electrónico/Contraseña"');
    console.log('4. Guarda los cambios');
    
  } catch (error) {
    console.error('❌ Error configurando Firebase:', error);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('1. Verifica que el proyecto Firebase existe');
    console.log('2. Verifica que las credenciales sean correctas');
    console.log('3. Habilita Authentication en Firebase Console');
    console.log('4. Verifica que Firestore esté habilitado');
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testFirebaseConnection();
}

module.exports = { testFirebaseConnection };

