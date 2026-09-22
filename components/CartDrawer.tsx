'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartProvider';

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close cart"
          onClick={closeCart}
          className="backdrop-fade fixed inset-0 z-40 bg-biggs-green/50 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform bg-biggs-cream shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-biggs-green/10 px-6 py-5">
            <h2 className="font-display text-xl text-biggs-green">Your Cart</h2>
            <button
              onClick={closeCart}
              aria-label="Close cart"
              className="text-biggs-green/70 hover:text-biggs-green"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <p className="mt-8 text-center text-sm text-biggs-green/60">
                Your cart is empty - go build a box.
              </p>
            ) : (
              <ul className="space-y-5">
                {items.map((line) => (
                  <li key={line.id} className="flex gap-4">
                    <Image
                      src={line.image}
                      alt={line.title}
                      width={80}
                      height={80}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-biggs-green">{line.title}</p>
                        <button
                          onClick={() => removeItem(line.id)}
                          className="text-xs text-biggs-green/50 hover:text-biggs-green"
                        >
                          Remove
                        </button>
                      </div>
                      {line.properties && (
                        <p className="mt-1 text-xs text-biggs-green/60">
                          {[line.properties.flavour1, line.properties.flavour2, line.properties.flavour3]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            className="h-6 w-6 rounded border border-biggs-green/20 text-biggs-green"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="h-6 w-6 rounded border border-biggs-green/20 text-biggs-green"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-biggs-green">
                          {formatPrice(line.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-biggs-green/10 px-6 py-5">
            <div className="mb-4 flex items-center justify-between font-semibold text-biggs-green">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-pop block w-full rounded-full bg-biggs-yellow px-6 py-3 text-center font-semibold text-biggs-green"
            >
              View Cart & Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
