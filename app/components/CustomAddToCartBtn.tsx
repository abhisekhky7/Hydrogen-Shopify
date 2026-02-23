import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type { CartLineInput } from '@shopify/hydrogen/storefront-api-types';
import {useEffect} from 'react';
import {useCart} from '~/contexts/CartContext';

function AddToCartInner({
  children,
  disabled,
  fetcher,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  fetcher: any;
}) {
  const {openCart} = useCart();
  const isLoading = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      openCart();
    }
  }, [fetcher.state]);

  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`w-full addBtn flex justify-around items-center uppercase cursor-pointer hover:opacity-90 font-medium py-3 flex rounded-full transition-all ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">Adding...</span>
      ) : (
        children
      )}
    </button>
  );
}

export function CustomAddToCartBtn({
  lines,
  children,
  disabled,
}: {
  lines: Array<CartLineInput>;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines}}>
      {(fetcher) => (
        <AddToCartInner fetcher={fetcher} disabled={disabled}>
          {children}
        </AddToCartInner>
      )}
    </CartForm>
  );
}