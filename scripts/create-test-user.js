const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

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

async function createTestUser() {
  console.log('👤 Creando usuario de prueba...');
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Crear usuario de prueba
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'test@securetrux.com',
      'password123'
    );
    
    console.log('✅ Usuario creado exitosamente:');
    console.log('📧 Email:', userCredential.user.email);
    console.log('🆔 UID:', userCredential.user.uid);
    console.log('');
    console.log('🎉 ¡Ahora puedes hacer login con:');
    console.log('   Email: test@securetrux.com');
    console.log('   Contraseña: password123');
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('1. Verifica que Authentication esté habilitado en Firebase Console');
    console.log('2. Verifica que "Correo electrónico/Contraseña" esté habilitado');
    console.log('3. Verifica que el proyecto Firebase esté configurado correctamente');
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  createTestUser();
}

module.exports = { createTestUser };

