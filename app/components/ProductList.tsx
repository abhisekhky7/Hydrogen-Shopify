import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {GetProductsQuery} from 'storefrontapi.generated';
import {CustomAddToCartBtn} from './CustomAddToCartBtn';

type ProductNodes = GetProductsQuery['products']['nodes'];

interface ProductListProps {
  products: ProductNodes;
}

export default function ProductList({products}: ProductListProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="product-list grid max-w-[1300px] mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product: any) => {
        const selectedVariant = product.variants?.nodes?.[0];

        return (
          <div
            className="group relative bg-[#FAF1EA] rounded-lg md:rounded-xl overflow-hidden flex flex-col"
            key={product.id}
          >
            {/* The Link now only wraps the content, NOT the button */}
            <Link
              className="block flex-grow"
              to={`/my-product/${product.handle}`}
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  data={product.images.nodes[0]}
                  aspectRatio="1/1"
                  sizes="20rem"
                  className="object-cover w-full h-full transition-opacity duration-300"
                />
                {product.images.nodes[1] && (
                  <Image
                    data={product.images.nodes[1]}
                    aspectRatio="1/1"
                    sizes="20rem"
                    className="object-cover w-full h-full absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </div>

              <div className="p-3 sm:py-5 sm:p-4 text-center">
                <h2 className="font-semibold line-clamp-2 text-[1.25rem] leading-[1.2em]">
                  {product.title}
                </h2>
                <p className="line-clamp-2 my-2 leading-[1.2em] text-base text-black/50">
                  {product.description}
                </p>
                <div className="mt-2 font-bold"></div>
              </div>
            </Link>

            {/* Add to Cart Button is outside the Link */}
            <div className="px-4 pb-5 mt-auto">
              <CustomAddToCartBtn
                lines={
                  selectedVariant
                    ? [
                        {
                          merchandiseId: selectedVariant.id,
                          quantity: 1,
                          selectedVariant
                        },
                      ]
                    : []
                }
                disabled={!selectedVariant?.availableForSale}
              >
                <div className="flex px-4 justify-between items-center w-full">
                  <span>
                    {selectedVariant?.availableForSale
                      ? 'Add To Cart'
                      : 'Sold Out'}
                  </span>
                  {selectedVariant?.price && (
                    <span className="ml-2">
                      <Money data={selectedVariant.price} />
                    </span>
                  )}
                </div>
              </CustomAddToCartBtn>
            </div>
          </div>
        );
      })}
    </div>
  );
}
