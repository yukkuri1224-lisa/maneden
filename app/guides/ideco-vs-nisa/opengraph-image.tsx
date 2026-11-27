import { getGuideBySlug } from "@/lib/guides";
import { OG_SIZE, renderOgImage } from "@/lib/seo/og-image";
import { siteConfig } from "@/lib/site-config";

const guide = getGuideBySlug("ideco-vs-nisa")!;

export const alt = `${guide.title}｜${siteConfig.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: guide.title,
    tagline: `お金のガイド｜${siteConfig.name}`,
  });
}
