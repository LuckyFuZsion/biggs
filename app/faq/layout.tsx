import JsonLd from '@/components/JsonLd';
import { faqPageSchema } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta(
  'FAQ & Contact Us',
  'Answers on ordering, delivery, allergens and storage for Biggs Bakes cookies, plus how to get in touch.',
  '/faq',
);

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqPageSchema()} />
      {children}
    </>
  );
}
