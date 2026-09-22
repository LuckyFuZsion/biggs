import Image from 'next/image';
import Link from 'next/link';
import { Flavour } from '@/lib/types';

type FlavourCardProps = {
  flavour: Flavour;
  /** Yellow text for dark (green) backgrounds */
  onDark?: boolean;
  /** Hide the price (e.g. home signature grid) */
  hidePrice?: boolean;
};

export default function FlavourCard({
  flavour,
  onDark = false,
  hidePrice = false,
}: FlavourCardProps) {
  const nameClass = onDark
    ? 'font-semibold text-biggs-yellow'
    : 'font-semibold text-biggs-green';
  const priceClass = onDark
    ? 'text-sm text-biggs-yellow/80'
    : 'text-sm text-biggs-green/60';

  return (
    <Link
      href="/shop/build-your-box"
      className="group flex h-full flex-col text-center transition-transform duration-300 ease-out hover:-translate-y-1.5"
    >
      <div className="overflow-hidden rounded-2xl bg-transparent">
        <Image
          src={flavour.image}
          alt={flavour.name}
          width={768}
          height={768}
          className="aspect-square h-auto w-full bg-transparent object-contain transition-transform duration-300 ease-out group-hover:scale-110"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col items-center justify-start">
        <p
          className={`text-sm leading-snug md:text-base ${nameClass} ${
            hidePrice ? '' : 'min-h-[2.75rem]'
          }`}
        >
          {flavour.name}
        </p>
        {!hidePrice && (
          <p className={`mt-1 ${priceClass}`}>£{flavour.price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  );
}
