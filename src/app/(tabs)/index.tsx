import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductRow } from '@/components/product-row';
import { Card, HeroBadge, HeroCard } from '@/components/ui';
import { products } from '@/data/products';
import { colors, MAX_CONTENT_WIDTH } from '@/theme';

const stats = [
  { value: String(products.length), label: 'Products', color: colors.text },
  { value: '3', label: 'Primary tabs', color: colors.primaryDark },
  { value: '1', label: 'Global modal', color: colors.success },
];

export default function HomeScreen() {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <ProductRow
          product={item}
          onPress={() =>
            router.navigate({ pathname: '/product/[productId]', params: { productId: item.id, source: 'home' } })
          }
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <HeroCard style={styles.hero}>
            <View style={styles.heroCircleBottom} />
            <HeroBadge label="SHOPFLOW DEMO" />
            <Text style={styles.heroTitle}>Navigate like a real shopping app</Text>
            <Text style={styles.heroText}>
              Root Stack + adaptive Tabs + typed route params + global modal — all in one compact demo.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/review')}
              style={({ pressed }) => [styles.heroButton, pressed && { opacity: 0.85 }]}>
              <Ionicons name="create-outline" size={17} color={colors.text} />
              <Text style={styles.heroButtonText}>Open global Review modal</Text>
            </Pressable>
          </HeroCard>

          <View style={styles.stats}>
            {stats.map((stat) => (
              <Card key={stat.label} style={styles.stat}>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Featured products</Text>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionText}>Open several products to test stack history and Back behavior.</Text>
            <View style={styles.sourceChip}>
              <Text style={styles.sourceChipText}>source: home</Text>
            </View>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    padding: 17,
    paddingBottom: 32,
  },
  separator: { height: 11 },
  header: { marginBottom: 16 },
  hero: { paddingVertical: 18 },
  heroCircleBottom: {
    position: 'absolute',
    left: -30,
    bottom: -60,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#0B1330',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '900',
    marginTop: 12,
  },
  heroText: {
    color: '#D5DAE5',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  heroButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 16,
  },
  heroButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 14,
  },
  statValue: {
    fontSize: 21,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 22,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  sectionText: {
    flex: 1,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 17,
  },
  sourceChip: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sourceChipText: {
    color: '#1E3A8A',
    fontSize: 11,
    fontWeight: '800',
  },
});
