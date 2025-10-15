import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SecurityIcon } from './SecurityIcon';

interface SecurityButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  iconName?: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export const SecurityButton: React.FC<SecurityButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  iconName,
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButton);
        break;
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButtonText);
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButtonText);
        break;
      case 'danger':
        baseStyle.push(styles.dangerButtonText);
        break;
    }
    
    return baseStyle;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return SecurityColors.text.light;
      case 'secondary':
        return SecurityColors.primary.blue;
      default:
        return SecurityColors.text.light;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {iconName && (
            <SecurityIcon
              name={iconName}
              size={20}
              color={getIconColor()}
            />
          )}
          <ThemedText style={getTextStyle()}>{title}</ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  primaryButton: {
    backgroundColor: SecurityColors.primary.blue,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: SecurityColors.primary.blue,
  },
  dangerButton: {
    backgroundColor: SecurityColors.status.danger,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: SecurityColors.text.light,
  },
  secondaryButtonText: {
    color: SecurityColors.primary.blue,
  },
  dangerButtonText: {
    color: SecurityColors.text.light,
  },
});



