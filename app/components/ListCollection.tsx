import type { GetCollectionsQuery } from 'storefrontapi.generated';
import { Link } from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

// 1. Extract the nodes from the Collections query specifically
type CollectionNodes = GetCollectionsQuery['collections']['nodes'];

interface ListCollectionProps {
  // 2. Use the extracted type instead of any[]
  collections: CollectionNodes;
}

export default function ListCollection({ collections }: ListCollectionProps) {

    return(
        <section className='collections py-10 md:py-12 px-4' >
        <h2 className='text-center text-[1.5rem] font-semi py-4'>Collections</h2>
        <div className='flex gap-4 justify-center items-center'>
        { collections.map((collection: any) => {
            
            const hoverImageSrc = collection.hoverImage?.reference?.image?.url;
            
            return (
            <div key={ collection.id} className='rounded-lg overflow-hidden' >
                <Link to={`/my-collections/${collection.handle}`} className='relative hover:cursor-pointer'>
                    <Image 
                    data={collection.image}
                    aspectRatio="1/1"
                    sizes="200px"
                    className="object-cover w-full h-full"
                    />
                    <img 
                        src={hoverImageSrc} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-150" 
                    />
                </Link>
                <div className={ `${ collection.title } p-1` }>
                <h3 className='text-center text-white text-base font-medium'>{collection.title}</h3>
                </div>
            </div>
        )}
        
        )}
        </div>
        </section>
    )
}

