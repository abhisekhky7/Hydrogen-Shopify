import { Suspense } from "react";
import type { Route } from "../+types/root";
import { Await, useLoaderData, data } from "react-router";
import ProductList from "~/components/ProductList";

export async function loader({ context, params }: Route.LoaderArgs) {
  const { storefront } = context;
  const { handle } = params;

  if (!handle) {
    throw new Response("Collection handle is required", { status: 400 });
  }

  const collectionData = storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
      first: 10,
    },
  });

  return data({
    products: collectionData.then((res) => res.collection?.products.nodes ?? []),
  });
}

export default function Collection() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Suspense fallback={<div>Loading collection...</div>}>
      <Await resolve={products} errorElement={<div>Error loading collection</div>}>
        {(resolvedProducts) => <ProductList products={resolvedProducts} />}
      </Await>
    </Suspense>
  );
}


const COLLECTION_QUERY = `#graphql
    query GetCurrentCollection($first: Int!,$country: CountryCode, $language: LanguageCode, $handle: String )
    @inContext(country: $country,language: $language){
      collection(handle: $handle){
        products(first:$first){
            nodes{
                id
                title
                handle
                description
                featuredImage{
                    url
                }
                images(first:2){
                    nodes{
                        url
                    }
                }
                  priceRange{
                  minVariantPrice{
                    amount
                    currencyCode
                  }
                }
                variants(first: 1) {
                nodes {
                    id
                    availableForSale
                    price {
                    amount
                    currencyCode
                    }
                    compareAtPrice {
                    amount
                    currencyCode
                    }
                }
                }
            }
   
        }
      }
    }
`
