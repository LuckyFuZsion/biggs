import JsonLd from '@/components/JsonLd';
import { boxProductSchema } from '@/lib/schema';

export default function BuildYourBoxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          ...boxProductSchema(),
        }}
      />
      {children}
    </>
  );
}
