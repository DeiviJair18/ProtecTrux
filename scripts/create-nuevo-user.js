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

async function createNuevoUser() {
  console.log('👤 Creando usuario nuevo@email.com...');
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Crear usuario nuevo@email.com
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'nuevo@email.com',
      'password123'
    );
    
    console.log('✅ Usuario creado exitosamente:');
    console.log('📧 Email:', userCredential.user.email);
    console.log('🆔 UID:', userCredential.user.uid);
    console.log('');
    console.log('🎉 ¡Ahora puedes hacer login con:');
    console.log('   Email: nuevo@email.com');
    console.log('   Contraseña: password123');
    
  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️  El usuario nuevo@email.com ya existe');
      console.log('✅ Puedes hacer login con esas credenciales');
    }
  }
}

// Ejecutar la creación
if (require.main === module) {
  createNuevoUser();
}

module.exports = { createNuevoUser };

