import { Suspense, useEffect } from 'react';
import { Await } from 'react-router';
import { useOptimisticCart, CartForm, Money } from '@shopify/hydrogen';
import { useCart } from '~/contexts/CartContext';




  export default function CustomCart({ cart }:{cart:any}) {
  const { isCartOpen,closeCart } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      // Add the class when the cart opens
      document.body.classList.add('no-scroll');
    } else {
      // Remove it when it closes
      document.body.classList.remove('no-scroll');
    }

    // Cleanup: Ensure scroll is restored if the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div id="cart" className={`fixed inset-0 z-[100] ${isCartOpen ? 'flex' : 'hidden'}`}>
      <div onClick={closeCart} className="absolute inset-0 backdrop-blur-md bg-black/20" />
      
      <div className="Cart w-full lg:w-[40vw] bg-white ml-auto relative h-[100dvh] flex flex-col shadow-xl">
        <div className="px-6 py-5 bg-[#FaF1Ea] flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold">Cart</h2>
          <button className='cursor-pointer px-2' onClick={closeCart}>X</button>
        </div>

        <div className="flex-1 overflow-hidden"> 
          <Suspense fallback={<div className="px-6 py-4">Loading...</div>}>
            <Await resolve={cart}>
              {(resolvedCart) => <OptimisticCartContent cart={resolvedCart} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function OptimisticCartContent({ cart }) {
  const optimisticCart = useOptimisticCart(cart);
  const lines = optimisticCart?.lines?.nodes || [];
  const optimisticCost = optimisticCart?.cost?.totalAmount;

  if (lines.length === 0) {
    return <div className="px-6 py-4 text-gray-500">Your cart is empty</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {lines.map((line) => {
          const isUpdating = line.isOptimistic;
          return (
            <div key={line.id} className="item flex gap-4 mb-6 transition-opacity"
              style={{ opacity: isUpdating ? 0.4 : 1, filter: isUpdating ? 'grayscale(20%)' : 'none' }}>
              <div className="img flex h-[100px] rounded-lg w-[120px] overflow-hidden flex-shrink-0 bg-gray-50">
                {line.merchandise?.image && (
                  <img src={line.merchandise.image.url} alt={line.merchandise.product?.title} className="object-cover h-full w-full" />
                )}
              </div>
              <div className="item-detail flex-1">
                <h3 className="font-medium leading-[1.2em]">{line.merchandise?.product?.title || 'Loading...'}</h3>
               <span className="block text-sm text-gray-600 mt-1">
              {line.cost?.totalAmount ? (
                <Money data={line.cost.totalAmount} />
              ) : (
                <span>—</span>
              )}
            </span>
                <div className="flex items-center mt-2 border border-gray-200 w-fit">
                  <CartLineUpdate lineId={line.id} quantity={line.quantity - 1} selectedVariant={line.merchandise}>
                    <button disabled={isUpdating} className="px-3 py-1 cursor-pointer">-</button>
                  </CartLineUpdate>
                  <span className="w-8 text-center text-sm">{line.quantity}</span>
                  <CartLineUpdate lineId={line.id} quantity={line.quantity + 1} selectedVariant={line.merchandise}>
                    <button disabled={isUpdating} className="px-3 py-1 cursor-pointer">+</button>
                  </CartLineUpdate>
                </div>
              </div>
                    <CartLineUpdate lineId={line.id} quantity={0} selectedVariant={line.merchandise}>
                    <button disabled={isUpdating} className="text-sm text-red-500 font-medium tracking-normal cursor-pointer">Remove</button>
                      </CartLineUpdate>


            </div>
          );
        })}
      </div>

      <div className="px-6 py-6 border-t border-gray-100 bg-white flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Total</h3>
         <div className="text-lg font-bold">
          {optimisticCost ? (
            <Money data={optimisticCost} />
          ) : (
            <span>—</span>
          )}
        </div>
        </div>
        <a href={ optimisticCart?.checkoutUrl} className="w-full block text-center block bg-black text-white py-4 rounded-full font-medium hover:opacity-90 transition-opacity">

          Checkout
        </a>
      </div>
    </div>
  );
}

function CartLineUpdate({children,lineId,quantity}:{children:React.ReactNode,lineId:string,quantity:number,selectedVariant:any}){
    return ( 
    <CartForm route="/cart" 
      inputs={{lines:[{id:lineId,quantity}]}}
       action={CartForm.ACTIONS.LinesUpdate}>
        { children}
        </CartForm>)
  
}
