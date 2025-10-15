import { SecurityColors } from '@/constants/security-colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SecurityIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

export const SecurityIcon: React.FC<SecurityIconProps> = ({
  name,
  size = 24,
  color = SecurityColors.primary.blue,
  backgroundColor,
  style,
}) => {
  const iconStyle = [
    styles.container,
    backgroundColor && { backgroundColor },
    style,
  ];

  return (
    <View style={iconStyle}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});



