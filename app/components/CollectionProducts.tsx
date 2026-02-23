
export default function CollectionProducts({products}){


    return(
      { products.map((product)=>(
        <h2>{product.title}</h2>
      ))}
    )
}