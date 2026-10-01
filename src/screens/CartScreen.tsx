import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { STUDENT, ROOM_LABEL, PRICE_MULTIPLIER } from '@constants/student';
import { THEME } from '@constants/theme';
import { useCartStore, CartItem } from '@stores/cartStore';
import Watermark from '@components/Watermark';

export const CartScreen: React.FC = () => {
  const {
    items,
    changeQty,
    removeItem,
    totalAmount,
    clearCart,
    distanceKm,
    shipFee,
  } = useCartStore();

  const subtotal = totalAmount();
  const effectiveShipFee = shipFee ?? 0;
  const grandTotal = subtotal + (items.length > 0 ? effectiveShipFee : 0);

  const renderItem = ({ item }: { item: CartItem }) => {
    const itemUnitPrice = Math.round(item.price * PRICE_MULTIPLIER);

    return (
      <View style={styles.itemCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
          resizeMode="contain"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>
            {itemUnitPrice.toLocaleString('vi-VN')} đ
          </Text>

          <View style={styles.itemActionRow}>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, -1)}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => changeQty(item.id, 1)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeItem(item.id)}
            >
              <Text style={styles.deleteBtnText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Giỏ Hàng KTXGo</Text>
          <Text style={styles.deliveryRoom}>
            Giao đến: <Text style={styles.roomBadge}>{ROOM_LABEL}</Text>
          </Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Xóa hết</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySub}>
            Hãy quay lại tab Cửa hàng để thêm món ăn, đồ uống nhé!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => `cart-${STUDENT.mssv}-${item.id}`}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Bill & Summary Box */}
      {items.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền món:</Text>
            <Text style={styles.summaryValue}>
              {subtotal.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Phí ship ({distanceKm !== null ? `${distanceKm} km` : 'Chưa định vị'}):
            </Text>
            <Text style={styles.shippingValue}>
              {effectiveShipFee > 0
                ? `${effectiveShipFee.toLocaleString('vi-VN')} đ`
                : 'Mở tab Tôi để định vị'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalValue}>
              {grandTotal.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.8}
            onPress={() => { }}
          >
            <Text style={styles.checkoutBtnText}>
              Đặt giao tận phòng ({ROOM_LABEL})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Watermark />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primary,
  },
  deliveryRoom: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 2,
  },
  roomBadge: {
    color: THEME.secondary,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 13,
    color: THEME.error,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: THEME.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.primary,
    marginBottom: 8,
  },
  itemActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  qtyValue: {
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
    color: THEME.text,
  },
  deleteBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteBtnText: {
    color: THEME.error,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.textLight,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: THEME.surface,
    padding: 16,
    borderTopWidth: 1,
    borderColor: THEME.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: THEME.textLight,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text,
  },
  shippingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.primary,
  },
  checkoutBtn: {
    backgroundColor: THEME.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CartScreen;