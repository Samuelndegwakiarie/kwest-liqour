import { getHeroImages } from "@/lib/db";
import ContactClient from "./ContactClient";

export const revalidate = 3600; // Cache page for up to 1 hour, automatically revalidated via dashboard updates

export default async function ContactPage() {
  const images = await getHeroImages();
  return <ContactClient initialImages={images} />;
}
