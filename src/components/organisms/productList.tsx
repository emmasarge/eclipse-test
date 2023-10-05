import React from 'react';
import { useProductData } from '../../hooks/cardData';

export function ProductList() {
  const { loading, error, products } = useProductData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
console.log(products)
  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>
              <img src={product.image} alt={product.title} />
            </div>
            <h3>{product.title}</h3>
            <p>Price: ${product.price.toFixed(2)}</p>
            {/* Add more card data properties here */}
          </li>
        ))}
      </ul>
    </div>
  );
}

