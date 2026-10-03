import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatPrice, type Product } from '@/data/products';
import { categoryColors, colors } from '@/theme';

export function ProductRow({ product, onPress }: { product: Product; onPress: () => void }) {
  const tone = categoryColors[product.category];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
      {({ pressed }) => (
        <>
          <View style={[styles.code, { backgroundColor: tone.solid }]}>
            <Text style={styles.codeText}>{product.id.slice(2)}</Text>
          </View>
          <View style={styles.body}>
            <Text style={[styles.name, pressed && styles.namePressed]} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={styles.meta}>
              <View style={[styles.tag, { backgroundColor: tone.soft }]}>
                <Text style={[styles.tagText, { color: tone.text }]}>{product.category}</Text>
              </View>
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            </View>
          </View>
          <View style={[styles.chevron, pressed && styles.chevronPressed]}>
            <Ionicons name="chevron-forward" size={16} color={colors.muted} />
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  rowPressed: {
    backgroundColor: '#F1F6FF',
    borderColor: '#9DB8F5',
  },
  code: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  body: {
    flex: 1,
    gap: 5,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  namePressed: {
    color: colors.primaryDark,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  price: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronPressed: {
    backgroundColor: '#DCE7FE',
  },
});
