import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MoodBox Bloom – Originální sladké kytice a dárkové boxy",
    short_name: "MoodBox Bloom",
    description:
      "Ručně tvořené sladké kytice a dárkové boxy s prémiovou čokoládou a alkoholem.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3E7DF",
    theme_color: "#C88D9A",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

