import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta('Your Cart', 'Review your Biggs Bakes cookie box and check out.', '/cart', true);

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
