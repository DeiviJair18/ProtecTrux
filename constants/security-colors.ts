export const SecurityColors = {
  // Colores principales de seguridad
  primary: '#1E3A8A',      // Azul principal
  secondary: '#6B7280',    // Gris secundario
  success: '#10B981',      // Verde éxito
  warning: '#F59E0B',       // Amarillo advertencia
  danger: '#EF4444',        // Rojo peligro
  info: '#3B82F6',          // Azul información
  
  // Colores de estado
  status: {
    safe: '#10B981',      // Verde seguro
    warning: '#F59E0B',   // Amarillo advertencia
    danger: '#EF4444',    // Rojo peligro
    info: '#3B82F6',      // Azul información
  },
  
  // Colores de fondo
  background: {
    light: '#F8FAFC',
    dark: '#0F172A',
    card: '#FFFFFF',
    cardDark: '#1E293B',
  },
  
  // Colores de texto
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#FFFFFF',
    muted: '#9CA3AF',
  },
  
  // Colores de borde
  border: {
    light: '#E5E7EB',
    dark: '#374151',
  },
  
  // Colores específicos de Trujillo
  trujillo: {
    gold: '#D4AF37',      // Oro de la ciudad
    heritage: '#8B4513',  // Marrón patrimonio
    ocean: '#006994',     // Azul océano Pacífico
  }
};

export const getStatusColor = (status: 'safe' | 'warning' | 'danger' | 'info') => {
  return SecurityColors.status[status];
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'police_officer':
      return SecurityColors.primary;
    case 'emergency_responder':
      return SecurityColors.danger;
    case 'security_guard':
      return SecurityColors.success;
    case 'admin':
      return SecurityColors.trujillo.gold;
    default:
      return SecurityColors.primary;
  }
};



