import React, { useState } from "react";

const galleryOneImages = [
  new URL("../assets/galleryone/image.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 2.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 3.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 4.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 5.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 6.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 7.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 8.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 9.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 10.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 11.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 12.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 13.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 14.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 15.png", import.meta.url).href,
  new URL("../assets/galleryone/image copy 16.png", import.meta.url).href,
];

const galleryFourImages = Object.entries(
  import.meta.glob("../assets/galleryfour/*.{png,jpg,jpeg,webp,avif}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src);

const categories = [
  {
    title: "Brand Stories",
    images: ["/gallery1.png", "/gallery2.png", "/gallery3.jpeg",  "/gallery5.jpeg", "/gallery6.jpeg",  ...galleryOneImages],
  },
  {
    title: "Product Launches",
    images: [
      new URL("../assets/gallerytwo/image.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 2.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 3.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 4.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 5.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 6.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 7.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 8.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 9.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 10.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 11.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 12.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 13.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 14.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 15.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 16.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 17.png", import.meta.url).href,
      new URL("../assets/gallerytwo/image copy 18.png", import.meta.url).href,
    ],
  },
  // {
  //   title: "Workspace Design",
  //   images: ["/gallery6.jpeg", "/bg.jpg", "/img.jpeg", "/card.jpeg", "/sample.jpg", "/bookCover.jpg", "/gallery1.png", "/gallery2.png"],
  // },
  {
    title: "Founder Moments",
    images: [
      new URL("../assets/gallerythree/image.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 2.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 3.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 4.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 5.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 6.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 7.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 8.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 9.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 10.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 11.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 12.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 13.png", import.meta.url).href,
      new URL("../assets/gallerythree/image copy 14.png", import.meta.url).href,
    ],
  },
  {
    title: "Community Events",
    images: galleryFourImages,
  },
  // {
  //   title: "Creative Labs",
  //   images: ["/img.jpeg", "/card.jpeg", "/sample.jpg", "/bookCover.jpg", "/gallery1.png", "/gallery2.png", "/gallery3.jpeg", "/gallery4.jpeg"],
  // },
];

export default function Blogs() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-28 sm:px-10 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="text-[0.75rem] font-bold tracking-[0.4em] uppercase text-white/40 block mb-4">Gallery</span>
          <h1 className="font-serif text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[0.95] uppercase tracking-[-0.05em]">
            Visual Gallery
          </h1>
          
        </div>

        <div className="space-y-14">
          {categories.map((category) => (
            <section key={category.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.25em] text-white">
                  {category.title}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.images.map((src, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setActiveImage(src)}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-[0_20px_60px_rgba(0,0,0,0.25)] block transition-all duration-300 hover:border-white/30 focus:outline-none"
                  >
                    <img
                      src={src}
                      alt={`${category.title} ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-44 w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
          <div className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-black shadow-[0_30px_120px_rgba(0,0,0,0.7)] overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-20 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm uppercase tracking-[0.2em] text-white transition hover:border-white/50 hover:bg-white/10"
            >
              Back
            </button>
            <img
              src={activeImage}
              alt="Preview"
              className="h-[70vh] w-full object-contain bg-black"
            />
          </div>
        </div>
      )}
    </main>
  );
}
