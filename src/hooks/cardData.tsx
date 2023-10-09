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
  inventory: number;
}

interface CardData extends Product {}

export const useProductData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<CardData[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<CardData[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
      const cardDataWithRandomInventory = response.data
        .filter((product) => product.category.toLowerCase() !== 'jewelery')
        .map((product) => ({
          ...product,
          formattedPrice: product.price.toFixed(2),
        }));
      setProducts(cardDataWithRandomInventory);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching product data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 10);
    setDisplayedProducts(randomProducts);
  }, [products]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchData(); 
    }, 180000); 

    return () => {
      clearInterval(refreshInterval); 
    };
  }, []);

  return { loading, error, products: displayedProducts };
};
