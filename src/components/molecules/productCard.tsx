import React, { useState, useEffect } from "react";
import { RatingStars } from "./ratingStars";
import { ReactComponent as Check } from "../../assets/icons/check.svg";
import { ReactComponent as Bars } from "../../assets/icons/bars.svg";
import { ReactComponent as Heart } from "../../assets/icons/heart.svg";

import InventoryCounter from "./inventoryCounter";
import useDeviceType from "../../hooks/isMobile";

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
  inventory: number;
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
  const [randomNumber] = useState<number>(() => Math.floor(Math.random() * 91));
  const [showAllDescription, setShowAllDescription] = useState<boolean>(false);
  const isMobile = useDeviceType();

  const handleToggleDescription = () => {
    setShowAllDescription(!showAllDescription);
  };
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
        setTimeRemaining("Stale Data");
      }
    };

    const timerInterval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    calculateTimeRemaining();

    return () => clearInterval(timerInterval);
  }, [refreshTimestamp]);

  let originalPrice = (Number(product.formattedPrice) * 1.2).toFixed(2);

  let savingsPrice = (
    Number(originalPrice) - Number(product.formattedPrice)
  ).toFixed(2);

  const sentenceRegex =
    /(?<=[.!?])\s+(?=[A-Z][a-z])|(?<=[.!?])\s+(?=[A-Z][A-Z])/;

  const description = product.description.split(sentenceRegex);

  return (
    <div
      className={
        isRecommended
          ? "w-11/12 lg:min-h-[420px] mb-2 mt-6 lg:mb-8 bg-white rounded-[20px] border-2 border-zinc-800 recommended-shadow pb-6 lg:pb-4 flex flex-col lg:px-4 "
          : "w-11/12 lg:min-h-[420px] bg-white mt-6 rounded-[20px] shadow mb-2 lg:mb-8 items-start pb-6 lg:py-4 flex lg:px-4"
      }
    >
      {isRecommended ? (
        <div className="w-fit lg:w-[195px] ml-2.5 lg:ml-[2.5em] lg:h-10 pt-1.5 pb-2 px-3 lg:p-2.5 bg-gradient-to-br from-zinc-800 to-stone-900 rounded-bl-[5px] rounded-br-[5px] justify-start items-start gap-2.5 inline-flex">
          <p className="text-white text-sm  md:text-base font-bold font-['Open Sans'] leading-tight">
            Eclipse recommended
          </p>
        </div>
      ) : null}

      <div className="flex flex-col  lg:flex-row justify-between w-[95%] mx-auto lg:py-4">
        <div className="flex w-[95%] pt-4  mx-auto lg:mx-0 lg:w-1/4 items-center justify-center pb-5 lg:pb-0 lg:justify-start lg:pt-2">
          <img
            className="w-fit max-h-[280px]"
            src={product.image}
            alt={product.title}
          />
        </div>

        <div className=" lg:mx-10 pl-3 flex w-full  lg:w-2/3 flex-col justify-between lg:min-h-[350px]">
          <div>
            {" "}
            <h1 className="text-zinc-800 w-[95%] text-[1.45em] leading-[1.2em] font-bold font-['Open Sans']">
              {product.title}
            </h1>
            <div className="flex flex-row items-center mt-[0.05em] lg:mt-[0.25em]">
              <div className="h-7 flex justify-center items-start  w-[150px] lg:max-w-[180px] ">
                <RatingStars
                  height={"h-[2rem] md:h-[1.35em]"}
                  rating={product.rating.rate}
                />
              </div>
              <div></div>
              <p className="text-zinc-800 text-base font-normal font-['Open Sans'] leading-relaxed">
                {product.rating.count} Reviews
              </p>
            </div>
            <div className="mt-4 lg:mt-7 w-[95%] lg:w-10/12">
              {description.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex justify-start items-start"
                >
                  <div
                    className={
                      "flex-row text-zinc-800  flex items-start justify-start max-h-fit leading-[1.2em] mb-2 w-full " +
                      (!showAllDescription && index >= 3 ? "hidden" : "")
                    }
                  >
                    <div>
                      <Check className="w-[1em] lg:w-[0.95em] pt-[0.35em] " />
                    </div>
                    <p className="pl-2" key={index}>
                      {item}
                    </p>
                  </div>
                </div>
              ))}
              {description.length > 3 && (
                <button
                  className="text-slate-600 text-sm hover:italic hover:text-slate-900 transition ease-in-out duration-300 hover:duration-300 underline underline-offset-[3px] font-light cursor-pointer mt-2"
                  onClick={handleToggleDescription}
                >
                  {showAllDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
          {!isMobile && (
            <div className=" w-full pl-2 relative pt-4 bottom-0">
              <div className="w-[58px]   flex flex-row justify-between">
                <Heart className="w-[1.5em] h-[1.25em] p-[0.075em] opacity-60  border border-[#939393]" />
                <Bars className="w-[1.5em] h-[1.25em] p-[0.075em] opacity-60  border border-[#939393]" />
              </div>
            </div>
          )}
        </div>
        <div
          className={
            isRecommended
              ? "w-[95%] lg:w-1/3 flex flex-col items-start mt-3 lg:-mt-4 "
              : " w-[95%] mx-auto lg:w-1/3 flex flex-col items-start mt-3 lg:mt-0 "
          }
        >
          <div
            className={
              isRecommended
                ? "w-full lg:w-[177px] h-[57px] lg:h-[87px] relative flex "
                : "w-full lg:w-[177px] h-[50px] relative"
            }
          >
            <div className="flex flex-row items-center mt-5 lg:mt-0 justify-center ">
              <div
                className={
                  isRecommended
                    ? "left-[3px]  top-[16px]  lg:absolute text-rose-600 text-3xl font-['Sequel Sans'] font-bold mt-1"
                    : "left-[3px] top-[16px] mt-2.5  absolute text-slate-800 text-3xl font-['Sequel Sans'] font-bold mt-1"
                }
              >
                £{product.formattedPrice}
              </div>

              {isRecommended && (
                <div className="px-1.5 ml-3 mt-1 lg:mt-1 lg:ml-0 py-[3px] left-[5px] font-bold top-[56px] h-fit  lg:absolute bg-rose-600 bg-opacity-20 rounded justify-start items-start gap-2.5 inline-flex">
                  <div className="text-rose-600 text-md font-bold font-['Sequel Sans']">
                    Save £{savingsPrice}
                  </div>
                </div>
              )}
            </div>
            <div className="w-[200px] h-[17px] left-[3px]  top-[4px] absolute">
              <div className="left-[2px] pl-1 text-stone-400 text-md font-bold font-['Sequel Sans']">
                RRP £{originalPrice}
              </div>
              <div className="w-[102.49px] h-[0px] flex justify-center items-center left-0 top-[15px] absolute origin-top-left rotate-[-5.65deg] border border-stone-400"></div>
            </div>
          </div>
          <div className="w-full flex mx-auto items-center justify-center">
            <InventoryCounter
              product={product}
              onAddToBasket={() => onAddToBasket(product.id)}
              timeRemaining={timeRemaining}
              subtractInventory={randomNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
