import {getSelectedProductOptions} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {Await, useLoaderData, type LoaderFunctionArgs} from 'react-router';
import {CustomAddToCartBtn} from '~/components/CustomAddToCartBtn';
import ProductImages from '~/components/ProductImages';
import RenderVariant from '~/components/RenderVariant';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {handle} = params;
  const productPromise = storefront
    .query(PRODUCT_QUERY, {
      variables: {
        handle: handle,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        selectedOptions: getSelectedProductOptions(request),
      },
    })
    .then((res) => {
      if (!res?.product) {
        throw new Response('Product not found', {status: 404});
      }
      return res.product;
    });

  return productPromise;
}

export default function ProductPage() {
  const deferredData = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<div>Loading..</div>}>
      <Await
        resolve={deferredData}
        errorElement={<div>Error loading product</div>}
      >
        {(product) => {
          const selectedVariant = product.selectedOrFirstAvailableVariant;
          return (
            <div className="w-full px-4 md:px-6 lg:px-10 py-10 flex flex-col lg:flex-row">
              {/* Image Slider */}
              <div className="w-full min-h-[500px] lg:w-1/2">
                <ProductImages
                  media={product.media.nodes}
                  selectedVariant={selectedVariant}
                />
              </div>
              {/* Product Details */}
              <div className="w-full lg:w-1/2 lg:px-8">
                <h1 className="text-[2rem] sm:text-[3.5rem] text-black leading-none">
                  {product.title}
                </h1>
                <div className="mt-4 text-base sm:text-2xl font-semibold">
                  {selectedVariant?.price.amount}{' '}
                  {selectedVariant?.price.currencyCode}
                  {selectedVariant?.compareAtPrice && (
                    <span className="ml-3 text-gray-400 line-through text-lg">
                      {selectedVariant.compareAtPrice.amount}
                    </span>
                  )}
                </div>
                <p className="text-base leading-[1.2em] mt-4 sm:mt-8">
                  {product.description}
                </p>
                <div className="mt-3">
                  <RenderVariant product={product} />
                </div>
                <div className='mt-10'>
                  <CustomAddToCartBtn
                    lines={
                      selectedVariant
                        ? [
                            {
                              merchandiseId: selectedVariant.id,
                              quantity: 1,
                              selectedVariant,
                            },
                          ]
                        : []
                    }
                    disabled={!selectedVariant?.availableForSale}
                  >
                    {selectedVariant?.availableForSale
                      ? 'Add To Cart'
                      : 'Sold Out'}
                  </CustomAddToCartBtn>
                </div>
              </div>
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
fragment ProductVariant on ProductVariant{
  availableForSale
  compareAtPrice{
    amount
    currencyCode
  }
  id
  image{
    url
    id
  }
  price{
    amount
    currencyCode
  }
  product{
    title
    handle
  }
  selectedOptions{
    name
    value
  }
  title
}
` as const;

const PRODUCT_FRAGMENT = `#graphql
fragment Product on Product {
  id
  title
  handle
  description   
   encodedVariantExistence
    encodedVariantAvailability
  options{
    name
    optionValues{
      name
      firstSelectableVariant {
        ...ProductVariant
      }
    }
  }
  selectedOrFirstAvailableVariant(selectedOptions:$selectedOptions,ignoreUnknownOptions: true, caseInsensitiveMatch: true){
    ...ProductVariant
  }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
     media(first: 10) {
      nodes {
        mediaContentType
        ... on MediaImage {
          image {
            url
            altText
          }
        }
        ... on Video {
          id
          sources {
            url
            mimeType
            format
          }
          previewImage {
            url
          }
        }
        ... on ExternalVideo {
          id
          embedUrl
          host
        }
        ... on Model3d {
          id
          sources {
            url
          }
        }
      }
    }
}
${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query GetProduct($handle: String
  $selectedOptions:[SelectedOptionInput!]! 
  $country: CountryCode
   $language: LanguageCode)
@inContext(country: $country, language: $language) {
  product(handle: $handle) {
   ...Product
  }
}
  ${PRODUCT_FRAGMENT}
` as const;
