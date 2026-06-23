import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Default Seeding Data
const DEFAULT_PRODUCTS = [
  { brand: "JOHNNIE WALKER", name: "Black Label Scotch", price: 5800, tag: "BEST SELLER", img: "/johnnie_walker_black_noir_1778448563770.png", category: "Whisky", volume: "750ml", stock: 48, visible: true, description: "A classic blended Scotch whisky, aged for 12 years. Johnnie Walker Black Label is renowned for its smooth, deep, and complex character, featuring hints of dark fruits, sweet vanilla, and signature smoky undertones. Excellent neat, on the rocks, or in a highball." },
  { brand: "GILBEY'S", name: "Special Dry Gin", price: 1795, tag: "POPULAR", img: "/gilbeys_gin_noir_1778448582122.png", category: "Gin", volume: "750ml", stock: 62, visible: true, description: "Gilbey's Special Dry Gin is a traditional London Dry style gin. It features a clean, juniper-forward profile with crisp citrus notes and a subtle botanical spice finish. Perfect for classic gin and tonics or refreshing summer cocktails." },
  { brand: "HENNESSY", name: "VS Cognac", price: 6500, tag: "LUXURY", img: "/hennessy_vs_noir_1778448600750.png", category: "Cognac", volume: "750ml", stock: 24, visible: true, description: "Hennessy Very Special (V.S) is one of the most popular cognacs in the world. Matured in new oak casks, Hennessy V.S is bold and fragrant. Its signature character is a dry fruit sweetness blended with toasted almond, oak wood, and delicate grape notes." },
  { brand: "JAMESON", name: "Irish Whiskey", price: 3200, tag: "TRENDING", img: "/jameson_whiskey_noir_1778448618517.png", category: "Whisky", volume: "750ml", stock: 36, visible: true, description: "Jameson is a triple-distilled, blended Irish whisky, aged in oak casks for a minimum of 4 years. Known for its signature smoothness, it delivers sweet orchard fruit aromas, light floral notes, vanilla cream, and a warm, woody-spiced finish." },
  { brand: "DON JULIO", name: "Blanco Tequila", price: 12500, tag: "LIMITED", img: "/don_julio_blanco_noir_1778448639327.png", category: "Tequila", volume: "750ml", stock: 8, visible: true, description: "Don Julio Blanco is a super-premium tequila made from 100% blue Weber agave. Crisp agave aromas lead into a palate of clean citrus, black pepper, and sweet grass. Extremely smooth, it is ideal for premium margaritas or sipping neat." },
  { brand: "TANQUERAY", name: "London Dry Gin", price: 3500, tag: null, img: "/tanqueray_london_dry_noir.png", category: "Gin", volume: "1000ml", stock: 41, visible: true, description: "Tanqueray London Dry Gin is distilled four times in copper pot stills for ultimate purity. It features a perfectly balanced botanical blend of juniper, coriander, angelica root, and liquorice. Clean, bold, and incredibly refreshing." },
  { brand: "PENFOLDS", name: "Koonunga Hill Shiraz", price: 4200, tag: "POPULAR", img: "/vintage_wines_category_noir.png", category: "Wines", volume: "750ml", stock: 19, visible: true, description: "Penfolds Koonunga Hill Shiraz is a premium Australian red wine. It is full-bodied and rich, with ripe dark cherry and blackberry flavors complemented by sweet spice and subtle oak integration. Pairs beautifully with steak or slow-roasted lamb." },
  { brand: "JOHNNIE WALKER", name: "Black Label (Pocket)", price: 2100, tag: null, img: "/johnnie_walker_black_noir_1778448563770.png", category: "Whisky", volume: "250ml", stock: 75, visible: true, description: "The iconic Johnnie Walker Black Label, packaged in a sleek, lightweight pocket-sized bottle. Perfect for taking on travels or sharing on small gatherings while preserving the full 12-year blended single malt quality." },
  { brand: "GILBEY'S", name: "Special Dry (Medium)", price: 1100, tag: null, img: "/gilbeys_gin_noir_1778448582122.png", category: "Gin", volume: "350ml", stock: 53, visible: true, description: "A convenient medium-sized bottle of Gilbey's Special Dry Gin, featuring the identical crisp juniper and citrus botanical recipe that has made Gilbey's a globally recognized standard for dry gins since 1857." },
  { brand: "HENNESSY", name: "VS Cognac (Half)", price: 3800, tag: null, img: "/hennessy_vs_noir_1778448600750.png", category: "Cognac", volume: "500ml", stock: 5, visible: true, description: "A half-sized decanter of Hennessy V.S Cognac, ideal for smaller celebrations or curated tastings. Delivers the robust toasted oak, vanilla cream, and dried fruit grape profile of the classic signature blend." }
];

const DEFAULT_BANNER = {
  title: "Father's Day Special Offer",
  description: "Get KES 1,000 off Johnnie Walker Black Label 750ml for a limited time.",
  img: "/johnnie_walker_black_noir_1778448563770.png",
  discountAmount: 1000,
  price: 4800,
  active: true,
  color: "#d4af37",
  endsAt: "2026-07-30T23:59:59.000Z"
};

const DEFAULT_HERO_IMAGES = [
  { page: "about", key: "cultural_anchor", url: "/nairobi_culture_noir_vision_1778448735584.png", alt: "Cultural Anchor" },
  { page: "about", key: "unrivaled_access", url: "/private_vault_noir_vision_1778448756948.png", alt: "Unrivaled Access" },
  { page: "about", key: "education_legacy", url: "/education_legacy_noir_vision.png", alt: "Education & Legacy" },
  { page: "about", key: "story_bottle", url: "/story_bottle_noir.png", alt: "Story Bottle Heritage" },
  { page: "contact", key: "private_tastings", url: "/private_tasting_noir.png", alt: "Private Tastings" },
  { page: "contact", key: "wholesale_trade", url: "/wholesale_trade_noir.png", alt: "Wholesale & Trade" },
  { page: "contact", key: "boutique_flagship", url: "/boutique_flagship_noir.png", alt: "The Boutique Flagship" }
];

const DEFAULT_SETTINGS = [
  { key: "store_name", value: "Kwest Liquor" },
  { key: "store_email", value: "concierge@kwestliquor.co.ke" },
  { key: "store_phone", value: "+254 700 123 456" },
  { key: "store_address", value: "Muthaiga Road, Nairobi, Kenya" },
  { key: "currency", value: "KES" },
  { key: "mpesa_code", value: "522522" },
  { key: "low_stock_threshold", value: "10" },
  { key: "free_delivery_threshold", value: "5000" }
];

async function ensureSeeded() {
  try {
    const productsCount = await prisma.product.count();
    if (productsCount === 0) {
      console.log("Seeding database with default values...");
      
      // Products
      for (const p of DEFAULT_PRODUCTS) {
        await prisma.product.create({ data: p });
      }

      // Banner
      await prisma.promoBanner.create({ data: DEFAULT_BANNER });

      // Hero/Card Images
      for (const img of DEFAULT_HERO_IMAGES) {
        await prisma.heroImage.create({ data: img });
      }

      // Settings
      for (const s of DEFAULT_SETTINGS) {
        await prisma.systemSetting.create({ data: s });
      }

      // Seeding dummy orders
      const orderId1 = "KW-9812-2026";
      await prisma.order.create({
        data: {
          id: orderId1,
          customer: "Sir Samuel Ndegwa",
          email: "samuel.ndegwa@gmail.com",
          phone: "+254712345678",
          total: 18100,
          delivery: "Rider",
          address: "Muthaiga Road, Nairobi",
          status: "Delivered",
          date: new Date("2026-06-18T10:30:00Z"),
          mpesaPhone: "254712345678",
          mpesaReceipt: "QHJ7KL29MN",
          mpesaAmount: 18100,
          mpesaStatus: "SUCCESS",
          mpesaTimestamp: "2026-06-18T10:31:44Z",
          items: {
            create: [
              { productId: 1, name: "Johnnie Walker Black Label", brand: "JOHNNIE WALKER", price: 5800, quantity: 2, volume: "750ml" },
              { productId: 3, name: "VS Cognac", brand: "HENNESSY", price: 6500, quantity: 1, volume: "750ml" }
            ]
          }
        }
      });

      console.log("Database seeded successfully.");
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// ─── Products ───────────────────────────────────────────────────
export async function getProducts() {
  await ensureSeeded();
  return prisma.product.findMany({
    orderBy: { id: "asc" }
  });
}

export async function getProductById(id: number) {
  await ensureSeeded();
  return prisma.product.findUnique({
    where: { id }
  });
}

export async function createProduct(data: any) {
  await ensureSeeded();
  return prisma.product.create({
    data: {
      brand: data.brand,
      name: data.name,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
      tag: data.tag || null,
      img: data.img || "/placeholder.png",
      category: data.category,
      volume: data.volume,
      stock: Number(data.stock) || 0,
      visible: data.visible !== false,
      description: data.description || ""
    }
  });
}

export async function updateProduct(id: number, data: any) {
  await ensureSeeded();
  const updateData: any = {};
  if (data.brand !== undefined) updateData.brand = data.brand;
  if (data.name !== undefined) updateData.name = data.name;
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.discountPrice !== undefined) updateData.discountPrice = data.discountPrice ? Number(data.discountPrice) : null;
  if (data.tag !== undefined) updateData.tag = data.tag || null;
  if (data.img !== undefined) updateData.img = data.img;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.volume !== undefined) updateData.volume = data.volume;
  if (data.stock !== undefined) updateData.stock = Number(data.stock);
  if (data.visible !== undefined) updateData.visible = data.visible;
  if (data.description !== undefined) updateData.description = data.description;

  return prisma.product.update({
    where: { id },
    data: updateData
  });
}

export async function deleteProduct(id: number) {
  await ensureSeeded();
  try {
    await prisma.product.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}

// ─── Orders ─────────────────────────────────────────────────────
export async function getOrders() {
  await ensureSeeded();
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { date: "desc" }
  });
}

export async function getOrderById(id: string) {
  await ensureSeeded();
  return prisma.order.findUnique({
    where: { id },
    include: { items: true }
  });
}

export async function createOrder(data: any) {
  await ensureSeeded();
  
  // Deduct stock for products
  try {
    for (const item of data.items) {
      const p = await prisma.product.findUnique({ where: { id: item.productId } });
      if (p) {
        const newStock = Math.max(0, p.stock - item.quantity);
        await prisma.product.update({
          where: { id: p.id },
          data: { stock: newStock }
        });
      }
    }
  } catch (err) {
    console.error("Failed to deduct stock:", err);
  }

  return prisma.order.create({
    data: {
      id: data.id || `KW-${Math.floor(1000 + Math.random() * 9000)}-2026`,
      userId: data.userId || null,
      customer: data.customer,
      email: data.email,
      phone: data.phone,
      total: Number(data.total),
      delivery: data.delivery,
      address: data.address || null,
      status: data.status || "Pending",
      mpesaPhone: data.mpesaPhone || null,
      mpesaReceipt: data.mpesaReceipt || null,
      mpesaAmount: data.mpesaAmount ? Number(data.mpesaAmount) : null,
      mpesaStatus: data.mpesaStatus || null,
      mpesaTimestamp: data.mpesaTimestamp || null,
      items: {
        create: data.items.map((item: any) => ({
          productId: Number(item.productId),
          name: item.name,
          brand: item.brand,
          price: Number(item.price),
          quantity: Number(item.quantity),
          volume: item.volume
        }))
      }
    },
    include: { items: true }
  });
}

export async function updateOrderStatus(id: string, status: string) {
  await ensureSeeded();
  return prisma.order.update({
    where: { id },
    data: { status }
  });
}

// ─── Analytics ──────────────────────────────────────────────────
export async function getAnalytics() {
  await ensureSeeded();
  const products = await prisma.product.findMany();
  const orders = await prisma.order.findMany({ include: { items: true } });

  // Calculations
  const totalRevenue = orders
    .filter(o => o.status === "Delivered" && o.mpesaStatus === "SUCCESS")
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const demographics = [
    { label: "Male", value: 61, color: "#d4af37" },
    { label: "Female", value: 31, color: "#c5a059" },
    { label: "Corporate", value: 8, color: "#8a6d3b" }
  ];

  // SVG monthly data
  const monthlyRevenue = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 49000 },
    { month: "Apr", revenue: 63000 },
    { month: "May", revenue: 58000 },
    { month: "Jun", revenue: totalRevenue || 75000 }
  ];

  // Recent Checkout logs
  const recentSales = orders.slice(0, 5).map(o => ({
    id: o.id,
    product: o.items[0]?.name || "Luxury Blend",
    customer: o.customer,
    amount: o.total,
    date: o.date.toISOString().split("T")[0],
    status: o.status
  }));

  // Top products
  const topProducts = products.slice(0, 4).map(p => ({
    name: p.name,
    brand: p.brand,
    sold: 15,
    revenue: 15 * p.price
  }));

  // Category breakdown
  const categoryBreakdown = [
    { category: "Whisky", percentage: 45 },
    { category: "Gin", percentage: 25 },
    { category: "Cognac", percentage: 15 },
    { category: "Tequila", percentage: 10 },
    { category: "Wines", percentage: 5 }
  ];

  return {
    totalRevenue: totalRevenue || 225300,
    revenueGrowth: 12.4,
    activeOrders,
    lowStockCount,
    monthlyRevenue,
    topProducts,
    categoryBreakdown,
    demographics,
    recentSales
  };
}

// ─── Promo Banners ──────────────────────────────────────────────
export async function getBanners() {
  await ensureSeeded();
  return prisma.promoBanner.findMany({
    orderBy: { id: "asc" }
  });
}

export async function createBanner(data: any) {
  await ensureSeeded();
  return prisma.promoBanner.create({
    data: {
      title: data.title,
      description: data.description,
      img: data.img || "/placeholder.png",
      discountAmount: Number(data.discountAmount) || 0,
      price: Number(data.price) || 0,
      active: data.active !== false,
      color: data.color || "#d4af37",
      endsAt: data.endsAt || null
    }
  });
}

export async function deleteBanner(id: number) {
  await ensureSeeded();
  try {
    await prisma.promoBanner.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function updateBanner(id: number, data: any) {
  await ensureSeeded();
  return prisma.promoBanner.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      img: data.img,
      discountAmount: data.discountAmount !== undefined ? Number(data.discountAmount) : undefined,
      price: data.price !== undefined ? Number(data.price) : undefined,
      active: data.active !== undefined ? data.active : undefined,
      color: data.color,
      endsAt: data.endsAt !== undefined ? (data.endsAt || null) : undefined
    }
  });
}

// ─── Newsletter ─────────────────────────────────────────────────
export async function getNewsletterSubscribers() {
  await ensureSeeded();
  return prisma.newsletterSubscriber.findMany({
    orderBy: { date: "desc" }
  });
}

export async function subscribeToNewsletter(email: string) {
  await ensureSeeded();
  try {
    return await prisma.newsletterSubscriber.create({
      data: { email }
    });
  } catch {
    // Unique constraint error - return existing
    return prisma.newsletterSubscriber.findUnique({
      where: { email }
    });
  }
}

// ─── Settings ───────────────────────────────────────────────────
export async function getSettings() {
  await ensureSeeded();
  const settings = await prisma.systemSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }
  return settingsMap;
}

export async function updateSettings(data: Record<string, any>) {
  await ensureSeeded();
  for (const [key, value] of Object.entries(data)) {
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    });
  }
  return getSettings();
}

// ─── Hero/Card Images ───────────────────────────────────────────
export async function getHeroImages() {
  await ensureSeeded();
  return prisma.heroImage.findMany();
}

export async function updateHeroImage(id: number, url: string) {
  await ensureSeeded();
  return prisma.heroImage.update({
    where: { id },
    data: { url }
  });
}

export async function updateHeroImageByKey(page: string, key: string, url: string) {
  await ensureSeeded();
  const match = await prisma.heroImage.findFirst({
    where: { page, key }
  });
  if (match) {
    return prisma.heroImage.update({
      where: { id: match.id },
      data: { url }
    });
  }
  return prisma.heroImage.create({
    data: { page, key, url, alt: key.replace(/_/g, " ") }
  });
}

// ─── Notifications ───────────────────────────────────────────────
export async function getNotifications() {
  await ensureSeeded();
  return prisma.notification.findMany({
    orderBy: { date: "desc" }
  });
}

// ─── Calendar Events ─────────────────────────────────────────────
export async function getCalendarEvents() {
  await ensureSeeded();
  return prisma.calendarEvent.findMany();
}
