import React, { useEffect, useState } from "react";
import { ReactComponent as Cart } from "../../assets/icons/cart.svg";
import { ReactComponent as Check } from "../../assets/icons/check.svg";
import { ReactComponent as Truck } from "../../assets/icons/truck.svg";
import useDeviceType from "../../hooks/isMobile";

interface Product {
  id: number;
  title: string;
}

interface InventoryCounterProps {
  product: Product;
  onAddToBasket: (productId: number) => void;
  timeRemaining: string;
  subtractInventory: number
}

const InventoryCounter: React.FC<InventoryCounterProps> = ({
  product,
  timeRemaining,
  subtractInventory
}) => {
  const [cartCount, setCartCount] = useState<number>(0);
  const [stockText, setStockText] = useState<string>("");
  const isMobile = useDeviceType();

  const [stockTextColor, setStockTextColor] =
    useState<string>("text-slate-800");

  const calculateInventoryPercentage = (): number => {
    const remainingInventory = (100 - cartCount) - subtractInventory;
    return remainingInventory < 0 ? 0 : remainingInventory;
  };
  const percentage = calculateInventoryPercentage();

  const getProgressBarColor = (): string => {
    if (percentage < 25) {
      return "bg-red-500";
    } else if (percentage < 50) {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  };

  useEffect(() => {
    if (percentage < 25) {
      setStockText("Few remaining left");
      setStockTextColor("text-red-500");
    } else if (percentage < 50) {
      setStockText("In stock");
    } else {
      setStockText("In stock");
    }
  }, [percentage, stockText]);

  const handleAddToCart = (productId: number) => {
    if (cartCount < 100) {
      setCartCount(cartCount + 1);
      console.log('Product ID added to basket:', productId);

    }
  };

  function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  function formatTomorrowDate(date: Date) {
    const day = date.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];

    const daySuffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";
    return `${day}${daySuffix} ${month}`;
  }

  const tomorrowDate = formatTomorrowDate(getTomorrowDate());

  return (
    <div className=" mx-auto lg:mx-0 w-full mt-0 flex flex-col justify-center items-center">
         <div className="w-full lg:h-[220px] flex flex-col justify-between">
<div className="w-full flex flex-col">
      <div className="h-2 flex max-w-[700px] mt-3 lg:mt-5 w-full mx-auto relative bg-gray-300  rounded-full overflow-hidden">
        <div
          style={{
            width: `${calculateInventoryPercentage()}%`,
            display: "flex",
          }}
          className={`h-full ${getProgressBarColor()} w-full rounded-full`}
        ></div>
      </div>
      <div className="w-full justify-start flex">
        <p className={`${stockTextColor} text-sm mt-[0.035em]`}>{stockText}</p>
      </div>

      <div className="w-[95%] mx-auto lg:w-full">
        <div className="mt-6 lg:mt-4 w-full ">
          <div className="flex flex-row items-start  justify-start mb-2">
            <div>
              <Truck className="w-[1.35em] lg:w-[1.25em] pt-[0.45em] " />
            </div>
            <p className="ml-2.5 leading-[1.12em]">
              Order in the next{" "}
              <span className="font-bold">{timeRemaining} minutes </span>for
              delivery on <span className="font-bold">{tomorrowDate}</span>
            </p>
          </div>

          {!isMobile && (
            <>
              <div className="flex mb-2 flex-rowitems-start justify-start">
                <div>
                  <Check className="w-[1em] lg:w-[0.95em] pt-[0.45em] " />
                </div>
                <p className="ml-2.5 leading-[1.2em]">Free UK delivery</p>
              </div>
              <div className="flex mb-2 flex-row items-start justify-start">
                <div>
                  <Check className="w-[1em] lg:w-[0.95em] pt-[0.45em] " />
                </div>
                <p className="ml-2.5 leading-[1.2em]">
                  Paypal credit available
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
      </div>
      <div className="w-full  flex justify-center lg:justify-start items-center mt-4 lg:mt-8">
        <button
          className="w-full shadow-md px-5 bg-gradient-to-br hover:opactiy-80 transition-all ease-out duration-300 hover:duration-300 cursor-pointer from-pink-600 to-fuchsia-800 rounded-full justify-center items-center  gap-2.5 py-2 inline-flex"
          onClick={() => handleAddToCart(product.id)}
        >
          <div className="flex flex-row w-11/12 lg:w-full justify-center">
            <div className="w-fit">
              <Cart className="w-[1.45em] lg:w-[1.5em]" />
            </div>
            <div className="ml-2 lg:ml-3 w-max flex justify-start items-start">
              <p className=" text-white uppercase text-lg tracking-wide lg:text-lg font-bold font-['Open Sans']">
                Add to basket
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default InventoryCounter;
