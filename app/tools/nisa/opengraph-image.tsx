import { getToolById } from "@/lib/tools-registry";
import { OG_SIZE, renderOgImage, truncateTagline } from "@/lib/seo/og-image";
import { siteConfig } from "@/lib/site-config";

const tool = getToolById("nisa")!;

export const alt = `${tool.title}｜${siteConfig.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({
    title: tool.title,
    tagline: truncateTagline(tool.description),
  });
}
