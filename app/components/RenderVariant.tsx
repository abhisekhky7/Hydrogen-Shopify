import { Link, useLocation } from 'react-router';
import { getProductOptions } from '@shopify/hydrogen';

export default function RenderVariant({ product }) {
  const options = getProductOptions(product);
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => (
        <div key={option.name} className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">
            {option.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {option.optionValues.map((value) => {
              const { name, selected, available, exists, variantUriQuery } = value;

              if (!exists) return null; // Don't show options that don't exist

              return (
                <Link
                  key={name}
                  to={`${pathname}?${variantUriQuery}`}
                  preventScrollReset
                  replace
                  className={`
                    relative border px-4 py-2 text-sm transition-all duration-200
                    ${selected 
                      ? 'border-black bg-black text-white shadow-md' 
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'}
                    ${!available ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {name}
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="h-[1px] w-full bg-gray-400 rotate-45" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}