const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

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

async function createAndTestUser() {
  console.log('👤 Creando y probando usuario...');
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Intentar crear usuario
    console.log('📝 Creando usuario nuevo@email.com...');
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'nuevo@email.com',
        'password123'
      );
      
      console.log('✅ Usuario creado exitosamente:');
      console.log('📧 Email:', userCredential.user.email);
      console.log('🆔 UID:', userCredential.user.uid);
      
    } catch (createError) {
      if (createError.code === 'auth/email-already-in-use') {
        console.log('ℹ️  El usuario ya existe, probando login...');
        
        // Intentar hacer login
        const loginCredential = await signInWithEmailAndPassword(
          auth,
          'nuevo@email.com',
          'password123'
        );
        
        console.log('✅ Login exitoso:');
        console.log('📧 Email:', loginCredential.user.email);
        console.log('🆔 UID:', loginCredential.user.uid);
        
      } else {
        throw createError;
      }
    }
    
    console.log('');
    console.log('🎉 ¡Usuario listo para usar!');
    console.log('📱 Usa estas credenciales en tu app:');
    console.log('   Email: nuevo@email.com');
    console.log('   Contraseña: password123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('🔧 Código de error:', error.code);
    
    if (error.code === 'auth/network-request-failed') {
      console.log('🌐 Problema de conexión. Verifica tu internet.');
    } else if (error.code === 'auth/invalid-email') {
      console.log('📧 Email inválido.');
    } else if (error.code === 'auth/weak-password') {
      console.log('🔒 Contraseña muy débil.');
    }
  }
}

// Ejecutar
if (require.main === module) {
  createAndTestUser();
}

module.exports = { createAndTestUser };

