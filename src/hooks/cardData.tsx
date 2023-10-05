import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
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

        // Add dummy data to each product (e.g., rating)
        const cardData = response.data.map((product) => ({
          ...product,
          // Add dummy data properties here
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
