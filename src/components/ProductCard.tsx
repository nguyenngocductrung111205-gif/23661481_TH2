import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PRICE_MULTIPLIER } from '@constants/student';
import { THEME } from '@constants/theme';
import { Product } from '@services/productApi';
import { triggerAddHaptic } from '@services/haptic';
import { useCartStore } from '@stores/cartStore';

interface ProductCardProps {
  item: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  const formattedPrice =
    Math.round(item.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';

  const handleAddPress = () => {
    triggerAddHaptic();

    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{item.emoji}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.price}>{formattedPrice}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.addIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: THEME.surface,
    borderRadius: 12,
    margin: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  imageContainer: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 56,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
    lineHeight: 18,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.primary,
    flex: 1,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
});

export default ProductCard;