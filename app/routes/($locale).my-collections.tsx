import { Suspense } from "react";
import { Await, useLoaderData, type LoaderFunctionArgs } from "react-router";
import ListCollection from "~/components/ListCollection";

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const collectionPromise = storefront.query(COLLECTION_QUERY,{
    variables:{
      country: storefront.i18n.country,
      language: storefront.i18n.language
    }
  }).then(response =>{
    if(!response || !response.collections) return [];
    return response.collections.nodes;
  }).catch((err) => {
    console.error("Collection Query Error:", err);
    return [];
  });

  return {
    deferredCollections: collectionPromise
  };
}

export default function MyCollections() {
  const {deferredCollections} = useLoaderData<typeof loader>();

  return (
    <>
      <Suspense fallback={<div>Loading collections..</div>}>
      <Await resolve={deferredCollections} errorElement={<div>Error loading collections</div>}>
       { (resolvedCollections) =>(
          <ListCollection collections={resolvedCollections} />
        )}

      </Await>
      </Suspense>
      </>
  );
}



const COLLECTION_QUERY = `#graphql
  query GetCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 10) {
      nodes {
        id
        title
        handle
        onlineStoreUrl
        image {
          url
          altText
          width
          height
        }
        # Fetching the specific metafield for the collection
        hoverImage: metafield(namespace: "custom", key: "hover_image") {
          value
          reference {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
        # Fetching the first 20 products in each collection
        products(first: 20) {
          nodes {
            id
            title
            handle
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;