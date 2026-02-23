import { useState, useEffect, Suspense } from 'react';
import { Await } from 'react-router';
import { useCart } from '~/contexts/CartContext';

export default function CustomHeader({cartPromise}:{cartPromise:Promise<any>}) {

  const { toggleCart } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling DOWN
        setIsVisible(false);
      } else {
        // Scrolling UP
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  return (
    <div 
      className={`
         bg-white fixed top-0 left-0 right-0 z-[100] flex justify-between px-6 py-4
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <a href="/" className="cursor-pointer">Home</a>
    <div className="flex items-center gap-1">
        <span onClick={toggleCart} id="cartToggle" className="cursor-pointer">
          Cart
        </span>
       <Suspense fallback={<span>(0)</span>} >
       <Await resolve={cartPromise}
       >
        {(cart)=>(
          <span className="rounded-full bg-black text-white text-[10px] font-semibold leading-none flex items-center justify-center w-4 h-4">
              {cart?.totalQuantity}
            </span>

        )}
       </Await>

       </Suspense>
      </div>
    </div>
  );
}