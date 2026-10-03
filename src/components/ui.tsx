import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Dark hero card with the decorative circle used on Home, Profile and Product Details. */
export function HeroCard({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.hero, style]}>
      <View style={styles.heroCircle} />
      {children}
    </View>
  );
}

export function HeroBadge({ label }: { label: string }) {
  return (
    <View style={styles.heroBadge}>
      <Text style={styles.heroBadgeText}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function IconTile({ name, color, background }: { name: IconName; color: string; background: string }) {
  return (
    <View style={[styles.iconTile, { backgroundColor: background }]}>
      <Ionicons name={name} size={18} color={color} />
    </View>
  );
}

type ButtonProps = {
  label: string;
  icon?: IconName;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  onPress: () => void;
};

export function Button({ label, icon, variant = 'primary', disabled, onPress }: ButtonProps) {
  const primary = variant === 'primary';
  const textColor = primary ? '#FFFFFF' : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonOutline,
        pressed && (primary ? styles.buttonPrimaryPressed : styles.buttonOutlinePressed),
        disabled && styles.buttonDisabled,
      ]}>
      {icon && <Ionicons name={icon} size={19} color={textColor} />}
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.hero,
    borderRadius: 20,
    padding: 17,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    top: -38,
    right: -38,
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: colors.heroCircle,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.heroBadge,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeText: {
    color: colors.heroAccent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonPrimaryPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.99 }],
  },
  buttonOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonOutlinePressed: {
    backgroundColor: colors.background,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
});
