const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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

async function testLogin() {
  console.log('🔐 Probando login...');
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    // Intentar hacer login
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'test@securetrux.com',
      'password123'
    );
    
    console.log('✅ Login exitoso!');
    console.log('📧 Email:', userCredential.user.email);
    console.log('🆔 UID:', userCredential.user.uid);
    console.log('✅ Email verificado:', userCredential.user.emailVerified);
    console.log('');
    console.log('🎉 ¡La autenticación está funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    console.log('');
    console.log('🔧 Código de error:', error.code);
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testLogin();
}

module.exports = { testLogin };

