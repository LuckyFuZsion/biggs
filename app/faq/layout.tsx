import JsonLd from '@/components/JsonLd';
import { faqPageSchema } from '@/lib/schema';

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqPageSchema()} />
      {children}
    </>
  );
}
