import { ThemedText } from '@/components/themed-text';
import { SecurityColors } from '@/constants/security-colors';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SecurityIcon } from './SecurityIcon';

interface SecurityInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconName: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const SecurityInput: React.FC<SecurityInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
      ]}>
        <SecurityIcon 
          name={iconName} 
          size={20} 
          color={isFocused ? SecurityColors.primary.blue : SecurityColors.text.muted}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={SecurityColors.text.muted}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <SecurityIcon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={SecurityColors.text.muted}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: SecurityColors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecurityColors.background.card,
    borderWidth: 1,
    borderColor: SecurityColors.text.muted,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputContainerFocused: {
    borderColor: SecurityColors.primary.blue,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: SecurityColors.status.danger,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: SecurityColors.text.primary,
  },
  errorText: {
    fontSize: 12,
    color: SecurityColors.status.danger,
    marginTop: 4,
  },
});



