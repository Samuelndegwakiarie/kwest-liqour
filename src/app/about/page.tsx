import { getHeroImages } from "@/lib/db";
import AboutClient from "./AboutClient";

export const revalidate = 3600; // Cache page for up to 1 hour, automatically revalidated via dashboard updates

export default async function AboutPage() {
  const images = await getHeroImages();
  return <AboutClient initialImages={images} />;
}
