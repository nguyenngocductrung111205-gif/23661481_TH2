import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { THEME } from '@constants/theme';
import { getProductById, Product } from '@services/productApi';
import { triggerAddHaptic } from '@services/haptic';
import { useCartStore } from '@stores/cartStore';
import Watermark from '@components/Watermark';
import { ShopStackParamList } from '@navigation/ShopStack';

type DetailRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
  });

  const handleAddToCart = () => {
    if (!product) return;

    triggerAddHaptic();

    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });

    Alert.alert(
      'Thêm vào giỏ thành công',
      `Món "${product.title}" đã được thêm vào giỏ hàng!\nMSSV: ${STUDENT.mssv}`
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={THEME.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy thông tin món!</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formattedPrice =
    product.price.toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chi tiết món #{id}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formattedPrice}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Đơn giá</Text>
          <Text style={styles.bottomPrice}>{formattedPrice}</Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>+ Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

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
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
  },
  headerBackBtn: {
    paddingVertical: 6,
  },
  headerBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  imageCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text,
    lineHeight: 24,
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.primary,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.textLight,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.surface,
    borderTopWidth: 1,
    borderColor: THEME.border,
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: THEME.textLight,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.primary,
  },
  addToCartButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: THEME.textLight,
  },
  errorText: {
    fontSize: 15,
    color: THEME.error,
    marginBottom: 12,
  },
  backBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DetailScreen;