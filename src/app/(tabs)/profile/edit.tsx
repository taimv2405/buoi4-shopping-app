import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useNavigation } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { useProfile, type Profile } from '@/context/profile';
import { confirmDiscard, showMessage } from '@/lib/dialogs';
import { colors, MAX_CONTENT_WIDTH } from '@/theme';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { profile, setProfile } = useProfile();
  const [draft, setDraft] = useState<Profile>(profile);
  const [focusedField, setFocusedField] = useState<keyof Profile | null>(null);

  const hasUnsavedChanges = draft.name !== profile.name || draft.email !== profile.email;

  // Runs only when this route is about to be *removed* (header Back, swipe back,
  // Android back). Switching tabs keeps the route mounted, so no warning there.
  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    confirmDiscard(() => navigation.dispatch(data.action));
  });

  const save = () => {
    setProfile(draft);
    showMessage('Saved', 'Profile changes have been saved.');
  };

  const fields: { key: keyof Profile; label: string }[] = [
    { key: 'name', label: 'Full name' },
    { key: 'email', label: 'Email' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable accessibilityRole="button" disabled={!hasUnsavedChanges} hitSlop={10} onPress={save}>
              <Text style={[styles.headerSave, !hasUnsavedChanges && styles.headerSaveDisabled]}>Save</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Account information</Text>
        <Text style={styles.subtitle}>
          Change a field, then press Back or swipe back to test unsaved-change protection.
        </Text>

        <Card style={styles.form}>
          {fields.map(({ key, label }) => (
            <View key={key}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                value={draft[key]}
                onChangeText={(value) => setDraft((d) => ({ ...d, [key]: value }))}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField(null)}
                autoCapitalize={key === 'email' ? 'none' : 'words'}
                keyboardType={key === 'email' ? 'email-address' : 'default'}
                autoCorrect={false}
                style={[styles.input, focusedField === key && styles.inputFocused]}
              />
            </View>
          ))}
        </Card>

        <View style={[styles.status, hasUnsavedChanges ? styles.statusDirty : styles.statusClean]}>
          <View style={[styles.statusIcon, { backgroundColor: hasUnsavedChanges ? '#FEF3C7' : '#D1FAE5' }]}>
            <Ionicons
              name={hasUnsavedChanges ? 'warning-outline' : 'checkmark-circle-outline'}
              size={18}
              color={hasUnsavedChanges ? colors.warning : colors.success}
            />
          </View>
          <View style={styles.statusBody}>
            <Text style={[styles.statusTitle, { color: hasUnsavedChanges ? '#92400E' : '#065F46' }]}>
              {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
            </Text>
            <Text style={styles.statusText}>
              usePreventRemove protects the route only when a navigation action would remove it.
            </Text>
          </View>
        </View>

        <Button label="Save changes" icon="save-outline" disabled={!hasUnsavedChanges} onPress={save} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: 17,
    paddingBottom: 40,
    gap: 14,
  },
  headerSave: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '800',
    paddingHorizontal: 4,
  },
  headerSaveDisabled: {
    color: colors.disabled,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: -10,
  },
  form: {
    gap: 14,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F8F9FD',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: '#3B6FD8',
  },
  status: {
    flexDirection: 'row',
    gap: 11,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  statusClean: {
    backgroundColor: colors.successSoft,
    borderColor: colors.successBorder,
  },
  statusDirty: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.warningBorder,
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBody: { flex: 1 },
  statusTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
});
