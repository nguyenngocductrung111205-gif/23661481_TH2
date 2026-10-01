import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  emoji: string;
  rating?: {
    rate: number;
    count: number;
  };
}

type ApiProduct = Omit<Product, 'emoji'>;

// ============================================================
// DANH SÁCH SẢN PHẨM KTXGo
// ID vẫn giữ nguyên theo Fake Store API.
// Chỉ thay đổi tên, emoji và nhóm hiển thị.
// ============================================================

const MENU: Record<
  number,
  {
    title: string;
    emoji: string;
    category: string;
    price: number;
  }
> = {
  1: {
    title: 'Cơm gà xối mỡ',
    emoji: '🍗',
    category: 'Đồ ăn',
    price: 45000,
  },

  2: {
    title: 'Mì ly hải sản',
    emoji: '🍜',
    category: 'Đồ ăn',
    price: 18000,
  },

  3: {
    title: 'Bánh mì thịt',
    emoji: '🥖',
    category: 'Đồ ăn',
    price: 25000,
  },

  4: {
    title: 'Xúc xích nướng',
    emoji: '🌭',
    category: 'Đồ ăn',
    price: 15000,
  },

  5: {
    title: 'Trà đào cam sả',
    emoji: '🍑',
    category: 'Nước uống',
    price: 30000,
  },

  6: {
    title: 'Cà phê sữa đá',
    emoji: '☕',
    category: 'Nước uống',
    price: 25000,
  },

  7: {
    title: 'Nước cam ép',
    emoji: '🍊',
    category: 'Nước uống',
    price: 22000,
  },

  8: {
    title: 'Sữa chua nếp cẩm',
    emoji: '🥛',
    category: 'Đồ ăn',
    price: 12000,
  },

  9: {
    title: 'Nước suối',
    emoji: '💧',
    category: 'Nước uống',
    price: 7000,
  },

  10: {
    title: 'Snack khoai tây',
    emoji: '🍟',
    category: 'Đồ ăn',
    price: 15000,
  },

  11: {
    title: 'Bút bi',
    emoji: '🖊️',
    category: 'Văn phòng phẩm',
    price: 5000,
  },

  12: {
    title: 'Tập vở',
    emoji: '📓',
    category: 'Văn phòng phẩm',
    price: 18000,
  },
};

// ============================================================
// Lấy emoji theo ID
// ============================================================

export const getEmojiById = (id: number): string => {
  return MENU[id]?.emoji ?? '🛍️';
};

// ============================================================
// Chuyển dữ liệu Fake Store API → dữ liệu KTXGo
// ============================================================

const toKtxProduct = (p: ApiProduct): Product => {
  const m = MENU[p.id];

  return {
    ...p,
    title: m?.title ?? p.title,
    category: m?.category ?? p.category,
    emoji: m?.emoji ?? '🛍️',
  };
};

// ============================================================
// Lấy danh sách sản phẩm
// GET /products?limit=12
// ============================================================

export const getProducts = async (
  limit: number = 12,
): Promise<Product[]> => {
  const response = await apiClient.get<ApiProduct[]>(
    `/products?limit=${limit}`,
  );

  return response.data.map(toKtxProduct);
};

// ============================================================
// Lấy chi tiết sản phẩm theo ID
// GET /products/:id
// ============================================================

export const getProductById = async (
  id: number,
): Promise<Product> => {
  const response = await apiClient.get<ApiProduct>(
    `/products/${id}`,
  );

  return toKtxProduct(response.data);
};