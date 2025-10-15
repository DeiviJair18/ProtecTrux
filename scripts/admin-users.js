const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, listUsers, deleteUser } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, getDocs } = require('firebase/firestore');

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Lista de usuarios de prueba con contraseñas conocidas
const TEST_USERS = [
  {
    email: 'admin@securetrux.com',
    password: 'admin123',
    name: 'Administrador',
    lastName: 'Sistema',
    phoneNumber: '+51999999999',
    role: 'admin',
    badge: 'ADM001',
    department: 'Administración'
  },
  {
    email: 'policia@securetrux.com',
    password: 'policia123',
    name: 'Juan',
    lastName: 'Pérez',
    phoneNumber: '+51988888888',
    role: 'police_officer',
    badge: 'POL001',
    department: 'Policía Nacional'
  },
  {
    email: 'ciudadano@securetrux.com',
    password: 'ciudadano123',
    name: 'María',
    lastName: 'González',
    phoneNumber: '+51977777777',
    role: 'citizen'
  },
  {
    email: 'jairferrerpajilla@gmail.com',
    password: 'jair123',
    name: 'Deivi Jair',
    lastName: 'Ferrer Pajilla',
    phoneNumber: '920772139',
    role: 'citizen'
  }
];

async function createAllTestUsers() {
  console.log('🚀 Creando todos los usuarios de prueba...');
  console.log('');
  
  for (const userData of TEST_USERS) {
    try {
      console.log(`👤 Creando usuario: ${userData.email}`);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      // Crear perfil en Firestore
      const userProfile = {
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        badge: userData.badge || null,
        department: userData.department || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);
      
      console.log(`✅ Usuario creado: ${userData.email}`);
      console.log(`   Contraseña: ${userData.password}`);
      console.log(`   UID: ${userCredential.user.uid}`);
      console.log('');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️  Usuario ${userData.email} ya existe`);
      } else {
        console.error(`❌ Error creando ${userData.email}:`, error.message);
      }
    }
  }
  
  console.log('🎉 ¡Usuarios de prueba listos!');
  console.log('');
  console.log('📋 Credenciales para login:');
  TEST_USERS.forEach(user => {
    console.log(`   ${user.email} / ${user.password} (${user.role})`);
  });
}

async function listAllUsers() {
  console.log('📋 Listando todos los usuarios...');
  console.log('');
  
  try {
    // Obtener usuarios de Firestore
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    console.log('👥 Usuarios en Firestore:');
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      console.log(`   ${userData.email} (${userData.role}) - ID: ${doc.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error listando usuarios:', error.message);
  }
}

async function testUserLogin(email, password) {
  console.log(`🔐 Probando login para: ${email}`);
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login exitoso!');
    console.log(`   Email: ${userCredential.user.email}`);
    console.log(`   UID: ${userCredential.user.uid}`);
    console.log(`   Email verificado: ${userCredential.user.emailVerified}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    return false;
  }
}

async function showMenu() {
  console.log('');
  console.log('🔧 ADMINISTRACIÓN DE USUARIOS SECURETRUX');
  console.log('==========================================');
  console.log('1. Crear todos los usuarios de prueba');
  console.log('2. Listar usuarios existentes');
  console.log('3. Probar login de usuario');
  console.log('4. Mostrar credenciales de prueba');
  console.log('5. Salir');
  console.log('');
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'create':
      await createAllTestUsers();
      break;
    case 'list':
      await listAllUsers();
      break;
    case 'test':
      const email = args[1];
      const password = args[2];
      if (email && password) {
        await testUserLogin(email, password);
      } else {
        console.log('❌ Uso: node admin-users.js test email password');
      }
      break;
    case 'credentials':
      console.log('📋 Credenciales de usuarios de prueba:');
      console.log('');
      TEST_USERS.forEach(user => {
        console.log(`   ${user.email} / ${user.password} (${user.role})`);
      });
      break;
    default:
      await showMenu();
      console.log('💡 Uso:');
      console.log('   node admin-users.js create    - Crear usuarios de prueba');
      console.log('   node admin-users.js list      - Listar usuarios');
      console.log('   node admin-users.js test email password - Probar login');
      console.log('   node admin-users.js credentials - Mostrar credenciales');
  }
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { createAllTestUsers, listAllUsers, testUserLogin, TEST_USERS };


