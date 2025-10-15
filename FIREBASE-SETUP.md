# 🔥 Configuración de Firebase para SecureTrux

Esta guía te ayudará a configurar completamente Firebase y Firestore Database para tu aplicación SecureTrux.

## 📋 Pasos para configurar la base de datos

### 1. ✅ Configuración de Firebase (YA COMPLETADO)
- ✅ Proyecto Firebase creado: `protectrux`
- ✅ Configuración agregada en `firebase.config.ts`
- ✅ Servicios inicializados (Auth, Firestore, Analytics)

### 2. 🗄️ Inicializar la base de datos

Ejecuta el siguiente comando para crear las colecciones y datos de ejemplo:

```bash
npm run db:init
```

O directamente:
```bash
node scripts/init-database.js
```

### 3. 🔒 Configurar reglas de seguridad

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `protectrux`
3. Ve a **Firestore Database** → **Reglas**
4. Copia y pega el contenido del archivo `firestore.rules`
5. Haz clic en **Publicar**

### 4. 📊 Verificar la configuración

Después de ejecutar el script, deberías ver estas colecciones en Firestore:

#### 👥 Colección `users`
- `admin-example` - Usuario administrador
- `police-example` - Oficial de policía
- `citizen-example` - Ciudadano

#### 📋 Colección `security_reports`
- `report-example` - Reporte de seguridad de ejemplo

#### 🚨 Colección `incidents`
- `incident-example` - Incidente asignado

#### ⚙️ Colección `system_config`
- `general` - Configuración del sistema

#### 🔔 Colección `notifications`
- `notification-example` - Notificación de ejemplo

## 🚀 Usar en tu aplicación

### Importar servicios
```typescript
import { db, auth, analytics } from './firebase.config';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';
```

### Ejemplo de registro de usuario
```typescript
try {
  const user = await AuthService.registerUser(
    'nuevo@usuario.com',
    'password123',
    {
      name: 'Juan',
      lastName: 'Pérez',
      phoneNumber: '+51999999999',
      role: UserRole.CITIZEN,
      isActive: true
    }
  );
  console.log('Usuario registrado:', user);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Ejemplo de crear reporte
```typescript
try {
  const reportId = await FirestoreService.createSecurityReport({
    userId: 'user-id',
    userEmail: 'usuario@email.com',
    userName: 'Juan Pérez',
    type: 'theft',
    title: 'Robo reportado',
    description: 'Descripción del incidente',
    location: {
      address: 'Dirección del incidente',
      coordinates: { latitude: -8.1115, longitude: -79.0289 }
    },
    severity: 'high',
    status: 'pending',
    priority: 'urgent'
  });
  console.log('Reporte creado:', reportId);
} catch (error) {
  console.error('Error:', error.message);
}
```

## 🔧 Comandos disponibles

```bash
# Inicializar base de datos
npm run db:init

# Ver configuración de Firebase
npm run firestore:setup

# Ver reglas de seguridad
npm run firestore:rules
```

## 📱 Roles de usuario

- **`citizen`** - Ciudadanos que pueden crear reportes
- **`police_officer`** - Oficiales que pueden asignar y resolver incidentes
- **`security_guard`** - Guardias de seguridad
- **`emergency_responder`** - Personal de emergencias
- **`admin`** - Administradores del sistema

## 🛡️ Seguridad

Las reglas de Firestore están configuradas para:
- ✅ Usuarios solo pueden acceder a sus propios datos
- ✅ Oficiales pueden ver y actualizar reportes
- ✅ Administradores tienen acceso completo
- ✅ Validación de roles en tiempo real

## 🚨 Solución de problemas

### Error: "Permission denied"
1. Verifica que las reglas de seguridad estén configuradas
2. Asegúrate de que el usuario esté autenticado
3. Verifica que el usuario tenga el rol correcto

### Error: "Collection not found"
1. Ejecuta `npm run db:init` para crear las colecciones
2. Verifica que Firebase esté configurado correctamente

### Error: "Invalid credentials"
1. Verifica la configuración en `firebase.config.ts`
2. Asegúrate de que las credenciales sean correctas

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola de Firebase
2. Verifica los logs de la aplicación
3. Consulta la documentación de Firebase
4. Revisa las reglas de seguridad en Firebase Console

---

¡Tu base de datos SecureTrux está lista para usar! 🎉
