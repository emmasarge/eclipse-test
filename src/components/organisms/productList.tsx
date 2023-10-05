import React, { useState, useEffect } from 'react';
import { useProductData } from '../../hooks/cardData';
import ProductCard from '../molecules/productCard';

function ProductList() {
  const { loading, error, products } = useProductData(); 
  const [refreshTimestamp, setRefreshTimestamp] = useState<number>(0);

  useEffect(() => {
    if (!loading && !error) {
      setRefreshTimestamp(Date.now());
    }
  }, [loading, error]);

  const handleAddToBasket = (productId: number) => {
    console.log('Product ID added to basket:', productId);
  };

// Find the product with the highest rating
const highestRatedProduct = products.length > 0
  ? products.reduce((prev, current) =>
      prev.rating.rate > current.rating.rate ? prev : current
    )
  : null;

  const sortedProducts = products.slice().sort((a, b) => b.rating.rate - a.rating.rate);

  const renderProductCards = () => {
    return sortedProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onAddToBasket={handleAddToBasket}
        refreshTimestamp={refreshTimestamp}
        isRecommended={product.id === highestRatedProduct?.id || false} 
      />
    ));
  };

  return (
    <div>
      {/* Render product cards */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        renderProductCards()
      )}
    </div>
  );
}

export default ProductList;
