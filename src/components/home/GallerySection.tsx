const GALLERY_IMAGES = Array.from({ length: 8 }, (_, i) => `/gallery/picture${i + 1}.png`)

export default function GallerySection() {
  return (
    <section className="py-20 px-6 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">Gallery</h2>

        {/* CSS columns give the organic masonry feel from your sketch, responsive by design */}
        <div className="columns-2 md:columns-4 gap-3 [&>*]:mb-3">
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-border break-inside-avoid">
              <img
                src={src}
                alt={`Mr. Cafe gallery ${i + 1}`}
                className="w-full h-auto object-cover hover:opacity-90 transition-opacity"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}