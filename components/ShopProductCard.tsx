import Image from 'next/image';
import Link from 'next/link';
import { Flavour } from '@/lib/types';

export default function ShopProductCard({ flavour }: { flavour: Flavour }) {
  return (
    <article className="card-lift flex h-full flex-col rounded-2xl bg-[#e8d9c8]/70 p-5 md:p-6">
      <div className="mx-auto aspect-square w-[72%] max-w-[220px] shrink-0 bg-transparent transition-transform duration-300 group-hover:scale-105">
        <Image
          src={flavour.image}
          alt={flavour.name}
          width={440}
          height={440}
          className="h-full w-full bg-transparent object-contain transition-transform duration-300 ease-out hover:scale-105"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>

      <div className="mt-5 flex min-h-0 flex-1 flex-col text-left">
        <h2 className="min-h-[3.5rem] font-display text-xl font-bold leading-tight text-biggs-green md:min-h-[4rem] md:text-2xl">
          {flavour.name}
        </h2>
        <p className="mt-2 min-h-[4.5rem] text-sm font-medium leading-relaxed text-biggs-green/65">
          {flavour.description}
        </p>

        <div className="mt-auto pt-4">
          <p className="text-base font-bold text-biggs-green">
            £{flavour.price.toFixed(2)}
          </p>
          <Link
            href="/shop/build-your-box"
            className="btn-pop mt-4 block w-full rounded-xl bg-biggs-green px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-biggs-cream"
          >
            Pre-Order
          </Link>
        </div>
      </div>
    </article>
  );
}
