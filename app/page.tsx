import Hero from '@/components/Hero';
import FlavourGrid from '@/components/FlavourGrid';
import StorySection from '@/components/StorySection';
import MailingList from '@/components/MailingList';
import JsonLd from '@/components/JsonLd';
import { shopProductsSchema } from '@/lib/schema';
import { getFlavours } from '@/lib/flavours';
import HomeFaq from '@/components/HomeFaq';

export default async function HomePage() {
  const flavours = await getFlavours();
  return (
    <>
      <JsonLd data={shopProductsSchema(flavours)} />
      <Hero />
      <FlavourGrid />
      <StorySection />
      <HomeFaq />
      <MailingList />
    </>
  );
}
