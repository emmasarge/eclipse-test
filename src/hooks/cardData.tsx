import { useState, useEffect } from "react";
import axios from "axios";

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

const CACHE_DURATION = 3 * 60 * 1000;
const API_URL = "https://fakestoreapi.com/products";

export const useProductData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<CardData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Product[]>(API_URL);

      const cardDataWithRandomInventory = response.data
        .filter((product) => product.category.toLowerCase() !== "jewelery")
        .map((product) => ({
          ...product,
          formattedPrice: product.price.toFixed(2),
        }));

      const randomProducts = cardDataWithRandomInventory
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      setDisplayedProducts(randomProducts);
      localStorage.setItem("displayedProducts", JSON.stringify(randomProducts));

      setLoading(false);

      const timestamp = new Date().getTime();
      localStorage.setItem(
        "productData",
        JSON.stringify({ data: cardDataWithRandomInventory, timestamp })
      );
      localStorage.setItem("lastFetchTimestamp", timestamp.toString());
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Error fetching product data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("productData");
    const lastFetchTimestamp = localStorage.getItem("lastFetchTimestamp");
    const currentTime = new Date().getTime();

    if (
      cachedData &&
      lastFetchTimestamp &&
      currentTime - parseInt(lastFetchTimestamp) < CACHE_DURATION
    ) {
     
      setDisplayedProducts(
        JSON.parse(localStorage.getItem("displayedProducts") || "[]")
      );
      setLoading(false);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const refreshData = async () => {
      if (!loading) {
        fetchData();
      }
    };

    const refreshInterval = setInterval(refreshData, CACHE_DURATION);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [loading]);

  return { loading, error, products: displayedProducts };
};
