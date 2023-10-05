import React, { useState, useEffect } from "react";
interface CardData {
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

interface ProductCardProps {
  product: CardData;
  onAddToBasket: (productId: number) => void;
  refreshTimestamp: number;
  isRecommended: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToBasket,
  refreshTimestamp,
  isRecommended,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const currentTime = Date.now();
      const timeSinceRefresh = currentTime - refreshTimestamp;
      const timeLeft = 3 * 60 * 1000 - timeSinceRefresh;

      if (timeLeft > 0) {
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        setTimeRemaining(`${hours}:${minutes}:${seconds}`);
      } else {
        // Data is stale
        setTimeRemaining("Stale Data");
      }
    };

    const timerInterval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    calculateTimeRemaining();

    return () => clearInterval(timerInterval);
  }, [refreshTimestamp]);

  return (
    <div className="w-full flex flex-col shadow-sm border border-black mx-auto">
      {isRecommended ? <p>Recommended</p> : null}
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <div>
        <img src={product.image} alt={product.title} />
      </div>
      <p>£{product.formattedPrice}</p>
      <p>{product.rating.rate}</p>
      <p>{product.rating.count}</p>

      <button onClick={() => onAddToBasket(product.id)}>Add to basket</button>
      <p>Order in the next {timeRemaining}</p>
      {/* Other product card details */}
    </div>
  );
};

export default ProductCard;
