import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProductRow } from '@/components/product-row';
import { products } from '@/data/products';
import { colors, MAX_CONTENT_WIDTH } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const keyword = query.trim().toLowerCase();
  const results = products.filter((p) =>
    [p.name, p.id, p.category].some((field) => field.toLowerCase().includes(keyword)),
  );

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <ProductRow
          product={item}
          onPress={() =>
            router.navigate({ pathname: '/product/[productId]', params: { productId: item.id, source: 'search' } })
          }
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Find your next read</Text>
          <Text style={styles.subtitle}>Search by title, product ID or category.</Text>

          <View style={[styles.searchBox, focused && styles.searchBoxFocused]}>
            <Ionicons name="search-outline" size={19} color={colors.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search products..."
              placeholderTextColor={colors.subtle}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              style={styles.input}
            />
            {query.length > 0 && (
              <Pressable accessibilityLabel="Clear search" hitSlop={10} onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.subtle} />
              </Pressable>
            )}
          </View>

          <View style={styles.resultsHeader}>
            <View style={styles.resultsTitleWrap}>
              <Text style={styles.resultsTitle}>Search results</Text>
              <Text style={styles.resultsHint}>Product Details receives source = &quot;search&quot;.</Text>
            </View>
            <View style={styles.countChip}>
              <Text style={styles.countChipText}>{results.length} items</Text>
            </View>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="search-outline" size={20} color={colors.muted} />
          </View>
          <Text style={styles.emptyTitle}>No products found</Text>
          <Text style={styles.emptyText}>Try another keyword, category or product ID.</Text>
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
  header: { marginBottom: 14 },
  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    backgroundColor: colors.surface,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    marginTop: 14,
  },
  searchBoxFocused: {
    borderColor: '#3B6FD8',
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  resultsTitleWrap: { flex: 1 },
  resultsTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  resultsHint: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  countChip: {
    backgroundColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  countChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  empty: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD2DE',
    paddingVertical: 38,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 14,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 5,
  },
});
