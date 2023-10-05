import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  formattedPrice: string;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface CardData extends Product {
  // Add any additional properties you want in the card data
  // Example: rating: number;
}

export const useProductData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<CardData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product[]>('https://fakestoreapi.com/products');

        const cardData = response.data
        .filter((product) => product.category.toLowerCase() !== 'jewelery') // Filter out "jewelery" category
        .map((product) => ({
          ...product,
          formattedPrice: product.price.toFixed(2), // Format price with 2 decimal places
        }));

        setProducts(cardData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, error, products };
};
