import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, HeroCard, IconTile } from '@/components/ui';
import { useProfile } from '@/context/profile';
import { colors, MAX_CONTENT_WIDTH } from '@/theme';

function initials(name: string) {
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
}

export default function ProfileScreen() {
  const { profile } = useProfile();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <HeroCard>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(profile.name)}</Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>UIT learner</Text>
        </View>
      </HeroCard>

      <Card style={styles.stackCard}>
        <IconTile name="git-branch-outline" color="#7C3AED" background="#F5F3FF" />
        <View style={styles.stackBody}>
          <Text style={styles.stackTitle}>Nested Profile Stack</Text>
          <Text style={styles.stackText}>
            Profile → Edit Profile drills down inside this tab, so primary navigation remains available.
          </Text>
        </View>
      </Card>

      <Card style={styles.contextCard}>
        <Text style={styles.contextLabel}>NAVIGATION CONTEXT</Text>
        <View style={styles.contextRow}>
          <Text style={styles.contextKey}>Primary destination</Text>
          <Text style={styles.contextValue}>Profile</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.contextRow}>
          <Text style={styles.contextKey}>Local navigator</Text>
          <Text style={styles.contextValue}>Native Stack</Text>
        </View>
      </Card>

      <Button label="Edit profile" icon="create-outline" onPress={() => router.push('/profile/edit')} />
    </ScrollView>
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
  avatar: {
    width: 53,
    height: 53,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 14,
  },
  email: {
    color: '#D5DAE5',
    fontSize: 12,
    marginTop: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: '#161C2E',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 12,
  },
  chipText: {
    color: '#E5E7EB',
    fontSize: 11,
    fontWeight: '700',
  },
  stackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stackBody: { flex: 1 },
  stackTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  stackText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  contextCard: {
    paddingTop: 14,
    paddingBottom: 4,
  },
  contextLabel: {
    color: colors.subtle,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contextKey: {
    color: colors.muted,
    fontSize: 13,
  },
  contextValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF0F4',
  },
});
