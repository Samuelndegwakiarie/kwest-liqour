import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src/lib/db_mock.json");

export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  tag: string | null;
  img: string;
  category: string;
  volume: string;
  stock: number;
  visible: boolean;
  description: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  volume: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  delivery: string;
  address: string | null;
  status: string;
  date: string;
  mpesa: {
    phone: string;
    receipt: string;
    amount: number;
    status: string;
    timestamp: string;
  };
}

export interface PromoBanner {
  id: number;
  text: string;
  active: boolean;
  color: string;
}

export interface Notification {
  id: number;
  type: string;
  message: string;
  date: string;
  read: boolean;
}

async function readDB() {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDB(data: unknown) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Products ───────────────────────────────────────────────────
export async function getProducts(): Promise<Product[]> {
  const db = await readDB();
  return db.products;
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = await readDB();
  return db.products.find((p: Product) => p.id === id) ?? null;
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const db = await readDB();
  const newId = db.products.length > 0 ? Math.max(...db.products.map((p: Product) => p.id)) + 1 : 1;
  const product: Product = { id: newId, ...data };
  db.products.push(product);
  await writeDB(db);
  return product;
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
  const db = await readDB();
  const idx = db.products.findIndex((p: Product) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...data };
  await writeDB(db);
  return db.products[idx];
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await readDB();
  const before = db.products.length;
  db.products = db.products.filter((p: Product) => p.id !== id);
  if (db.products.length === before) return false;
  await writeDB(db);
  return true;
}

// ─── Orders ─────────────────────────────────────────────────────
export async function getOrders(): Promise<Order[]> {
  const db = await readDB();
  return db.orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await readDB();
  return db.orders.find((o: Order) => o.id === id) ?? null;
}

export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  const db = await readDB();
  const idx = db.orders.findIndex((o: Order) => o.id === id);
  if (idx === -1) return null;
  db.orders[idx].status = status;
  await writeDB(db);
  return db.orders[idx];
}

// ─── Analytics ──────────────────────────────────────────────────
export async function getAnalytics() {
  const db = await readDB();
  return db.analytics;
}

// ─── Promo Banners ──────────────────────────────────────────────
export async function getBanners(): Promise<PromoBanner[]> {
  const db = await readDB();
  return db.promoBanners;
}

export async function createBanner(data: Omit<PromoBanner, "id">): Promise<PromoBanner> {
  const db = await readDB();
  const newId = db.promoBanners.length > 0 ? Math.max(...db.promoBanners.map((b: PromoBanner) => b.id)) + 1 : 1;
  const banner: PromoBanner = { id: newId, ...data };
  db.promoBanners.push(banner);
  await writeDB(db);
  return banner;
}

export async function deleteBanner(id: number): Promise<boolean> {
  const db = await readDB();
  const before = db.promoBanners.length;
  db.promoBanners = db.promoBanners.filter((b: PromoBanner) => b.id !== id);
  if (db.promoBanners.length === before) return false;
  await writeDB(db);
  return true;
}

// ─── Newsletter ─────────────────────────────────────────────────
export async function getNewsletterSubscribers() {
  const db = await readDB();
  return db.newsletterSubscribers;
}

// ─── Settings ───────────────────────────────────────────────────
export async function getSettings() {
  const db = await readDB();
  return db.settings;
}

export async function updateSettings(data: Record<string, unknown>) {
  const db = await readDB();
  db.settings = { ...db.settings, ...data };
  await writeDB(db);
  return db.settings;
}

// ─── Notifications ───────────────────────────────────────────────
export async function getNotifications(): Promise<Notification[]> {
  const db = await readDB();
  return db.notifications;
}

// ─── Countdown Timers ────────────────────────────────────────────
export async function getCountdownTimers() {
  const db = await readDB();
  return db.countdownTimers;
}

// ─── Hero Images ─────────────────────────────────────────────────
export async function getHeroImages() {
  const db = await readDB();
  return db.heroImages;
}

// ─── Calendar Events ─────────────────────────────────────────────
export async function getCalendarEvents() {
  const db = await readDB();
  return db.calendarEvents;
}
