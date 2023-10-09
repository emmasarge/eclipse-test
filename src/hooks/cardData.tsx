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
      setLoading(true);
      const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
      const cardDataWithRandomInventory = response.data
        .filter((product) => product.category.toLowerCase() !== 'jewelery')
        .map((product) => ({
          ...product,
          formattedPrice: product.price.toFixed(2),
        }));
      setProducts(cardDataWithRandomInventory);
      setLoading(false); 
      const timestamp = new Date().getTime();
      sessionStorage.setItem('productData', JSON.stringify({ data: cardDataWithRandomInventory, timestamp }));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching product data.');
      setLoading(false); 
    }
  };

  useEffect(() => {
    const cachedData = sessionStorage.getItem('productData');
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData as string);
      const currentTime = new Date().getTime();
      const cacheDuration = 3 * 60 * 1000;
  
      if (currentTime - timestamp < cacheDuration) {
        setProducts(data);
        setLoading(false);
        const displayedProducts = JSON.parse(sessionStorage.getItem('displayedProducts') as string); 
        setDisplayedProducts(displayedProducts);
        return;
      }
    }
  
    fetchData();
  }, []);
  useEffect(() => {
    const refreshData = async () => {
      if (!loading) {
        const cachedData = sessionStorage.getItem('productData');
        if (cachedData) {
          const { timestamp } = JSON.parse(cachedData);
          const currentTime = new Date().getTime();
          const cacheDuration = 3 * 60 * 1000;
  
          if (currentTime - timestamp >= cacheDuration) {
            fetchData();
          }
        } else {
          fetchData();
        }
      }
    };
  
    const refreshInterval = setInterval(refreshData, 180001);
  
    return () => {
      clearInterval(refreshInterval);
    };
  }, [loading]);

  useEffect(() => {
    const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 10);
    setDisplayedProducts(randomProducts);

    sessionStorage.setItem('displayedProducts', JSON.stringify(randomProducts));
  }, [products]);

  return { loading, error, products: displayedProducts };
};