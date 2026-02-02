import { describe, it } from "vitest";
import dotenv from "dotenv";
import { RandomImage, UnsplashProvider, PexelsProvider } from "../src";
dotenv.config();

describe("UnsplashProvider", () => {
  it("fetch with unsplash", async () => {
    const unsplash = new UnsplashProvider(process.env.UNSPLASH_KEY || "");

    const fetcher = new RandomImage(unsplash);
    const result = await fetcher.getRandom({
      width: 1920,
      height: 1080,
      query: "nature",
    });

    console.log(result);
  });

  it("fetch with pexels", async () => {
    const pexels = new PexelsProvider(process.env.PEXELS_KEY || "");

    const fetcher = new RandomImage(pexels);
    const result = await fetcher.getRandom({
      width: 1920,
      height: 1080,
      query: "nature",
    });

    console.log(result);
  });
});
