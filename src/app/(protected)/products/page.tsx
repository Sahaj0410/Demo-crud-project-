"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ApiError, getProducts } from "@/lib/api";
import type { Product, ProductsResponse } from "@/lib/types";

const PAGE_SIZE = 9;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getProducts(PAGE_SIZE, (page - 1) * PAGE_SIZE)
      .then((response) => setData(response))
      .catch((err) => {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Unable to load products.");
        }
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  if (isLoading) {
    return <div className="text-sm text-muted">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Product catalog
        </p>
        <h1 className="display-font mt-3 text-3xl font-semibold">Products</h1>
        <p className="mt-2 text-sm text-muted">
          Browse what is available and open a product to see full details.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 stagger">
        {data.products.map((product: Product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="surface-card card-hover group rounded-[24px] p-4"
          >
            <div className="relative h-48 w-full overflow-hidden rounded-[20px] bg-[color:var(--color-background)]">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                {product.category}
              </p>
              <h2 className="text-lg font-semibold text-[color:var(--color-foreground)]">
                {product.title}
              </h2>
              <p className="text-sm text-muted line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="font-semibold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs text-muted">
                  Rating {product.rating?.toFixed(1) ?? "-"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
