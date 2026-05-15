"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ApiError, getProductById } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setError("Invalid product ID.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getProductById(productId)
      .then((response) => setProduct(response))
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unable to load product details.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return <div className="text-sm text-muted">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-8">
      <Link
        href="/products"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted hover:text-[color:var(--color-accent)]"
      >
        Back to products
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card rounded-[28px] p-6">
          <div className="relative h-72 w-full overflow-hidden rounded-[22px] bg-[color:var(--color-background)]">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.images.slice(0, 4).map((image) => (
              <div
                key={image}
                className="relative h-20 overflow-hidden rounded-2xl border border-black/10"
              >
                <Image src={image} alt={product.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </section>
        <section className="surface-card rounded-[28px] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {product.category}
          </p>
          <h1 className="display-font mt-3 text-3xl font-semibold">
            {product.title}
          </h1>
          <p className="mt-4 text-sm text-muted">{product.description}</p>
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-semibold">
              ${product.price.toFixed(2)}
            </span>
            {product.discountPercentage ? (
              <span className="rounded-full bg-[color:var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-accent)]">
                {product.discountPercentage.toFixed(1)}% off
              </span>
            ) : null}
          </div>
          <div className="mt-8 grid gap-4 text-sm">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-muted">Rating</span>
              <span>{product.rating?.toFixed(1) ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-muted">Stock</span>
              <span>{product.stock ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-muted">Brand</span>
              <span>{product.brand ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">SKU</span>
              <span>{product.sku ?? "-"}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
