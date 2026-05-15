export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

export type AuthResponse = AuthUser & {
  token: string;
  refreshToken?: string;
};

export type StoredAuth = {
  token: string;
  user: AuthUser;
};

export type Address = {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type Company = {
  name?: string;
  title?: string;
  department?: string;
};

export type UserProfile = AuthUser & {
  phone?: string;
  birthDate?: string;
  gender?: string;
  company?: Company;
  address?: Address;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  sku?: string;
  availabilityStatus?: string;
  thumbnail: string;
  images: string[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
