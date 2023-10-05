import React from "react";
import "./index.css";
import ProductList from "./components/organisms/productList";

function App() {
  return (
    <div className="App w-full h-full min-h-screen pt-8 pb-36 overflow-y-scroll">
      <div className="flex justify-center items-center w-full">
      <ProductList /></div>
    </div>
  );
}

export default App;
