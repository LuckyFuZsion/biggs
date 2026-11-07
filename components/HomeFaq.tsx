import Link from 'next/link';
import Reveal from './Reveal';
import JsonLd from './JsonLd';
import { faqCategories } from '@/lib/data';
import { faqPageSchema } from '@/lib/schema';

/** Four of the questions from the FAQ page, shown on the homepage with Joe's own answers. */
const HOME_QUESTIONS = [
  'When will my order arrive?',
  'Where do you deliver and how much does delivery cost?',
  'How long do the cookies last?',
  'Do your cookies contain allergens?',
];

export default function HomeFaq() {
  const all = faqCategories.flatMap((c) => c.items);
  const items = HOME_QUESTIONS.map((q) => all.find((i) => i.question === q)).filter(
    (i): i is (typeof all)[number] => Boolean(i),
  );
  if (items.length === 0) return null;

  return (
    <section className="bg-biggs-cream pb-16 md:pb-20" data-speakable>
      <JsonLd data={faqPageSchema(items, '/#faq')} />
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <h2 className="text-center font-display text-3xl font-bold text-biggs-green md:text-4xl">
            Common questions
          </h2>
        </Reveal>
        <div className="mt-8 space-y-6">
          {items.map((item) => (
            <Reveal key={item.question} variant="up">
              <h3 className="font-display text-xl font-bold text-biggs-green">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-biggs-green/75">{item.answer}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-sm">
          <Link href="/faq" className="font-bold text-biggs-green underline underline-offset-2">
            See all FAQs
          </Link>
        </p>
      </div>
    </section>
  );
}
