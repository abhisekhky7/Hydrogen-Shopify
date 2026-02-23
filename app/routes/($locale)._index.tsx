import React, { Suspense } from "react";
import { useLoaderData, type LoaderFunctionArgs, Await } from "react-router";
import Banner from '../components/HeroBanner';
// Extract the type of a single product node from the query
import type { GetProductsQuery } from 'storefrontapi.generated';
import ListCollection from "~/components/ListCollection";

export function meta() {
  return [
    { title: "Chefees" },
    { description: "A custom storefront powered by Hydrogen" }
  ];
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const productPromise =  storefront.query(PRODUCT_QUERY, {
    variables: { 
      first: 10,
      country: storefront.i18n.country,
      language: storefront.i18n.language
    },
  }).then(response => {
    // Check for response and response.products directly
    if (!response || !response.products) return [];
    return response.products.nodes;
  }).catch((err) => {
    console.error("Query Error:", err);
    return [];
  });

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
    deferredProducts: productPromise,
    deferredCollections: collectionPromise
  };
}

export default function Index() {
  const { deferredProducts } = useLoaderData<typeof loader>();
  const {deferredCollections} = useLoaderData<typeof loader>();

  return (
    <>
      <Banner 
        title={<>Real Food, Real Flavour, <br/> Real Simple</>}
        subheading="Frozen meal kits designed for flavour, convenience, and your fast-paced lifestyle. Less prep, more time for what matters."
        button={{
          label: "Shop Now",
          link: "/my-collections"
        }}
      />

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

const PRODUCT_QUERY = `#graphql
  query GetProducts($first: Int!, $country: CountryCode, $language: LanguageCode) 
  @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        images(first: 1) {
          nodes {
            url
            altText
          }
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
`;


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
