import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { STUDENT, ROOM_LABEL, STALE_TIME_MS } from '@constants/student';
import { THEME } from '@constants/theme';
import { getProducts, Product } from '@services/productApi';
import useDebouncedValue from '@hooks/useDebouncedValue';
import ProductCard from '@components/ProductCard';
import Watermark from '@components/Watermark';
import { ShopStackParamList } from '@navigation/ShopStack';

type NavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => getProducts(12),
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    const lower = debouncedSearch.toLowerCase();
    return products.filter((item) => item.title.toLowerCase().includes(lower));
  }, [products, debouncedSearch]);

  const handleProductPress = (id: number) => {
    navigation.navigate('Detail', { id: String(id) });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerBrand}>KTXGo ⚡</Text>
          <Text style={styles.headerSubtitle}>
            Giao tận <Text style={styles.roomHighlight}>{ROOM_LABEL}</Text>
          </Text>
        </View>
        <View style={styles.badgeBox}>
          <Text style={styles.studentBadge}>{STUDENT.mssv}</Text>
        </View>
      </View>

      {/* Ô tìm kiếm Debounced */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm món ăn, nước uống..."
          placeholderTextColor={THEME.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCorrect={false}
        />
      </View>

      {/* 3 Cảnh Mạng */}
      <View style={styles.listContainer}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={THEME.primary} />
            <Text style={styles.loadingText}>Đang tải danh sách món...</Text>
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorTitle}>Lỗi kết nối mạng</Text>
            <Text style={styles.errorMessage}>
              Không thể tải dữ liệu [{STUDENT.mssv}]:{' '}
              {error instanceof Error ? error.message : 'Lỗi không xác định'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlashList
            data={filteredProducts}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                onPress={() => handleProductPress(item.id)}
              />
            )}
            numColumns={2}
            keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
            contentContainerStyle={styles.flashListContent}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetch();
                }}
                colors={[THEME.primary]}
                tintColor={THEME.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Không tìm thấy món phù hợp với từ khóa "{debouncedSearch}"
                </Text>
              </View>
            }
          />
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: THEME.surface,
    borderBottomWidth: 1,
    borderColor: THEME.border,
  },
  headerBrand: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  roomHighlight: {
    color: THEME.secondary,
    fontWeight: '700',
  },
  badgeBox: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  studentBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.primary,
  },
  searchContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: THEME.surface,
  },
  searchInput: {
    height: 42,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: THEME.text,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  listContainer: {
    flex: 1,
  },
  flashListContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: THEME.textLight,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.error,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 13,
    color: THEME.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyContainer: {
    paddingTop: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 14,
    color: THEME.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;
