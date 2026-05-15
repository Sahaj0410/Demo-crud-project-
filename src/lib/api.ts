import type {
  AuthResponse,
  AuthUser,
  Product,
  ProductsResponse,
  UserProfile,
} from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = response.statusText || "Request failed";

    try {
      const data = (await response.json()) as { message?: string };
      if (data?.message) {
        message = data.message;
      }
    } catch {}

    throw new ApiError(message, response.status);
  }

  return (await response.json()) as T;
}

export async function loginWithUsername(
  username: string,
  password: string,
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function findUserByEmail(
  email: string,
): Promise<AuthUser | null> {
  const data = await request<{ users: AuthUser[] }>(
    `/users/search?q=${encodeURIComponent(email)}`,
  );
  const match = data.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  return match ?? null;
}

export async function getProducts(
  limit: number,
  skip: number,
): Promise<ProductsResponse> {
  return request<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
}

export async function getProductById(id: number): Promise<Product> {
  return request<Product>(`/products/${id}`);
}

export async function getUserById(
  id: number,
  token?: string,
): Promise<UserProfile> {
  return request<UserProfile>(`/users/${id}`, {}, token);
}
