import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getProductBySlug } from "@/features/products";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const previousImages = (await parent).openGraph?.images ?? [];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${siteConfig.url}/products/${product.slug}`,
      siteName: siteConfig.name,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
        ...previousImages,
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export async function generateStaticParams() {
  return [{ slug: "sample-product" }];
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <nav className="mb-8 text-sm text-muted-fg">
        <span>Home</span>
        <span className="mx-2">/</span>
        <span>Products</span>
        <span className="mx-2">/</span>
        <span className="text-fg-app font-semibold">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-card border border-surface-border text-6xl shadow-md">
          📦
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-2 inline-block w-fit rounded-full bg-primary-teal/15 text-primary-teal px-3 py-1 text-xs font-bold uppercase tracking-wider">
            {product.category}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mb-6 text-lg leading-relaxed text-muted-fg">
            {product.description}
          </p>
          <p className="mb-8 text-2xl font-bold text-primary-teal">
            ${(product.price / 100).toFixed(2)}
          </p>
          <div className="flex gap-4">
            <Button variant="primary" size="lg">Add to Cart</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
