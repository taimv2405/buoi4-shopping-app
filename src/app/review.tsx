import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { getProduct } from '@/data/products';
import { showMessage } from '@/lib/dialogs';
import { colors, MAX_CONTENT_WIDTH } from '@/theme';

// Global modal declared once in the Root Stack. `productId` is optional so it can
// be opened from Home (general review) or from any Product Details instance.
export default function CreateReviewScreen() {
  const { productId } = useLocalSearchParams<{ productId?: string }>();
  const product = getProduct(productId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => showMessage('Review submitted', 'Demo only - no server request is sent.', () => router.back());

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Share your experience</Text>
      <Text style={styles.subtitle}>
        This modal lives at the Root Stack and can be opened from different areas without duplication.
      </Text>

      <Card style={styles.targetCard}>
        <View style={styles.targetIcon}>
          <Ionicons name="book-outline" size={19} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.targetLabel}>REVIEWING</Text>
          <Text style={styles.targetName}>
            {product ? `${product.id} · ${product.name}` : 'General shopping experience'}
          </Text>
        </View>
      </Card>

      <Card style={styles.ratingCard}>
        <Text style={styles.label}>Rating</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= rating;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`${value} star${value > 1 ? 's' : ''}`}
                accessibilityState={{ selected: value === rating }}
                onPress={() => setRating(value)}
                style={[styles.star, active ? styles.starActive : styles.starInactive]}>
                <Ionicons name={active ? 'star' : 'star-outline'} size={20} color={active ? '#FFFFFF' : '#5B6475'} />
              </Pressable>
            );
          })}
        </View>
      </Card>

      <View>
        <Text style={[styles.label, styles.commentLabel]}>Comment</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="What did you like about this product?"
          placeholderTextColor={colors.subtle}
          multiline
          textAlignVertical="top"
          style={[styles.comment, focused && styles.commentFocused]}
        />
      </View>

      <Button label="Submit review" icon="paper-plane-outline" onPress={submit} />
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
  targetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 13,
    paddingHorizontal: 13,
  },
  targetIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetLabel: {
    color: colors.subtle,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  targetName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  ratingCard: {
    gap: 12,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  commentLabel: {
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 7,
  },
  star: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starActive: {
    backgroundColor: colors.star,
  },
  starInactive: {
    backgroundColor: '#F1F3F8',
  },
  comment: {
    minHeight: 124,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 14,
    color: colors.text,
    fontSize: 14,
  },
  commentFocused: {
    borderColor: '#3B6FD8',
  },
});
