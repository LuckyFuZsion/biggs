import { getFlavours } from '@/lib/flavours';
import ShopProductCard from '@/components/ShopProductCard';
import BuildYourBoxSection from '@/components/BuildYourBoxSection';
import Reveal from '@/components/Reveal';
import ParallaxImage from '@/components/ParallaxImage';
import JsonLd from '@/components/JsonLd';
import { shopProductsSchema } from '@/lib/schema';
import { siteImage } from '@/lib/site-images';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta(
  "Shop Cookies - Build Your Box of 3",
  "Build your own box of 3 thick, gooey NYC-inspired cookies from six signature flavours. Baked fresh in the UK and delivered tracked.",
  "/shop",
);

export default async function ShopPage() {
  const flavours = await getFlavours();
  const shopHeroSrc = await siteImage('shopHero', '/images/shop-hero-box.webp');
  return (
    <div className="bg-biggs-cream">
      <JsonLd data={shopProductsSchema(flavours)} />
      <section id="cookies" className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-8 md:grid-cols-2 md:gap-10 md:py-10">
          <div>
            <h1 className="hero-enter font-display text-5xl font-bold leading-none text-biggs-green md:text-6xl lg:text-7xl">
              Biggs Cookies.
              <br />
              Bigger Bites.
            </h1>
            <p className="hero-enter hero-enter-delay-1 mt-5 max-w-xs text-base font-medium leading-relaxed text-biggs-green md:text-lg">
              Your cookie preferences are about to be updated...
            </p>
          </div>

          <div className="hero-image-enter relative flex justify-center overflow-hidden md:justify-end">
            <ParallaxImage
              src={shopHeroSrc}
              alt="A Biggs box of cookies"
              width={1350}
              height={1050}
              priority
              intensity={36}
              wrapperClassName="w-full overflow-hidden rounded-3xl"
              className="h-auto w-full rounded-3xl object-cover"
            />
          </div>
        </div>
      </section>

      <BuildYourBoxSection flavours={flavours} />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-4 md:pb-20">
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-biggs-green md:text-4xl">
            Our Flavours
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {flavours.filter((f) => f.inShop !== false).map((flavour, i) => (
            <Reveal key={flavour.id} delay={i * 70} variant="up">
              <ShopProductCard flavour={flavour} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
