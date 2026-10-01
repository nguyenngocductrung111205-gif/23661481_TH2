import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export const getProducts = async (limit: number = 12): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>(`/products?limit=${limit}`);
  return response.data;
};

export const getProductById = async (id: number | string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};
