import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { MOCK_DOCTORS } from "@/features/doctors/data/doctors";
import { getProducts } from "@/features/products/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  // Core public static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/doctors`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lab-tests`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pharmacy`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diagnostics`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/patient/reminders`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic specialist doctor profile routes
  const doctorRoutes: MetadataRoute.Sitemap = MOCK_DOCTORS.map((doc) => ({
    url: `${baseUrl}/doctors/${doc.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic product routes
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await getProducts();
    if (productsRes?.data) {
      productRoutes = productsRes.data.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || currentDate),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch {
    productRoutes = [
      {
        url: `${baseUrl}/products/sample-product`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      },
      {
        url: `${baseUrl}/products/analytics-suite`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      },
    ];
  }

  return [...staticRoutes, ...doctorRoutes, ...productRoutes];
}

