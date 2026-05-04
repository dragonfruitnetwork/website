import type {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "DragonFruit Network",
        short_name: "DragonFruit",
        description: "Home of OnionFruit™, Kaplan and various open-source projects.",
        start_url: "/",
        display: "browser",
        background_color: "#000000",
        theme_color: "#663bb9",
        icons: [
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png"
            }
        ]
    };
}
