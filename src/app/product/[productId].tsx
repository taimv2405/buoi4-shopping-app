import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, HeroBadge, HeroCard, IconTile } from '@/components/ui';
import { formatPrice, getProduct, getRelatedProductId, type ProductSource } from '@/data/products';
import { colors, MAX_CONTENT_WIDTH } from '@/theme';

export default function ProductDetailsScreen() {
  // Only the ID and where the user came from travel through the route;
  // the product itself is looked up from the data layer.
  const { productId, source } = useLocalSearchParams<{ productId: string; source?: ProductSource }>();
  const product = getProduct(productId);

  if (!product) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={36} color={colors.muted} />
        <Text style={styles.notFoundTitle}>Product not found</Text>
        <Text style={styles.notFoundText}>&quot;{productId}&quot; does not match any product.</Text>
      </View>
    );
  }

  const relatedId = getRelatedProductId(product.id);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <HeroCard>
        <HeroBadge label="PRODUCT DETAILS" />
        <Text style={styles.heroTitle}>{product.name}</Text>
        <Text style={styles.heroText}>{product.description}</Text>
        <Text style={styles.heroPrice}>{formatPrice(product.price)}</Text>
      </HeroCard>

      <Card style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Product ID</Text>
          <Text style={styles.infoValue}>{product.id}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Category</Text>
          <Text style={styles.infoValue}>{product.category}</Text>
        </View>
      </Card>

      <View style={styles.metaCard}>
        <View style={styles.metaHeader}>
          <Ionicons name="navigate-circle-outline" size={18} color="#1E3A8A" />
          <Text style={styles.metaTitle}>Route metadata</Text>
        </View>
        <Text style={styles.metaCode}>productId: {productId}</Text>
        <Text style={styles.metaCode}>source: {source ?? 'unknown'}</Text>
      </View>

      <Button
        label={`Open related: ${relatedId}`}
        icon="arrow-forward-circle-outline"
        // push (not navigate) so every related product becomes a new stack entry
        // and Back walks through them in reverse order.
        onPress={() =>
          router.push({ pathname: '/product/[productId]', params: { productId: relatedId, source: 'related' } })
        }
      />
      <Button
        label="Create review"
        icon="star-outline"
        variant="outline"
        onPress={() => router.push({ pathname: '/review', params: { productId: product.id } })}
      />

      <Card style={styles.historyCard}>
        <IconTile name="layers-outline" color="#7C3AED" background="#F5F3FF" />
        <View style={styles.historyBody}>
          <Text style={styles.historyTitle}>History test</Text>
          <Text style={styles.historyText}>
            Open several related products. Back should return through Product Details instances in reverse order.
          </Text>
        </View>
      </Card>
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
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 12,
  },
  heroText: {
    color: '#D5DAE5',
    fontSize: 12.5,
    lineHeight: 20,
    marginTop: 8,
  },
  heroPrice: {
    color: colors.heroAccent,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 16,
  },
  infoCard: {
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF0F4',
  },
  metaCard: {
    backgroundColor: '#EFF5FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E5FB',
    padding: 17,
    gap: 3,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  metaTitle: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '800',
  },
  metaCode: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
  },
  historyCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  historyBody: { flex: 1 },
  historyTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  historyText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  notFoundTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  notFoundText: {
    color: colors.muted,
    fontSize: 13,
  },
});
