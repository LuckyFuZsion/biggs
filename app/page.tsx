import Hero from '@/components/Hero';
import FlavourGrid from '@/components/FlavourGrid';
import StorySection from '@/components/StorySection';
import MailingList from '@/components/MailingList';
import JsonLd from '@/components/JsonLd';
import { shopProductsSchema } from '@/lib/schema';

export default function HomePage() {
  return (
    <>
      <JsonLd data={shopProductsSchema()} />
      <Hero />
      <FlavourGrid />
      <StorySection />
      <MailingList />
    </>
  );
}
