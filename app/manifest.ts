import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vibe Board",
    short_name: "Vibe Board",
    description: "A clean kanban board for vibe coders",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1816",
    theme_color: "#e0ad5a",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
  };
}
