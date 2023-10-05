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



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product[]>('https://fakestoreapi.com/products');

        const cardDataWithRandomInventory = response.data
          .filter((product) => product.category.toLowerCase() !== 'jewelery') // Filter out "jewelry" category
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

    fetchData();
  }, []);


  return { loading, error, products };
};
