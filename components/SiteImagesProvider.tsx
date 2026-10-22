'use client';

import { createContext, useContext } from 'react';
import { resolveImage, SiteImages, SiteImageSlot } from '@/lib/site-images';

const SiteImagesContext = createContext<SiteImages>({});

export function SiteImagesProvider({
  images,
  children,
}: {
  images: SiteImages;
  children: React.ReactNode;
}) {
  return <SiteImagesContext.Provider value={images}>{children}</SiteImagesContext.Provider>;
}

/** For client components: the picture for a slot, with the built-in file as the fallback. */
export function useSiteImage(slot: SiteImageSlot, fallback: string): string {
  return resolveImage(useContext(SiteImagesContext), slot, fallback);
}
