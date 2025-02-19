import React from "react";
import { Button } from "antd";
import Image from "next/image";

import Logo from "@/assets/logo.png";

const Home = () => (
  <div className="App flex flex-col items-center justify-center h-full">
    <h1
      className="text-4xl font-bold
        text-center text-gray-900 mb-6 flex items-center"
    >
      Welcome to
      <span>
        <Image
          src={Logo}
          alt="Logo"
          className="bg-black ml-4 p-4 rounded-3xl"
        />
      </span>
    </h1>
    <a href="/menus">
      <Button type="primary">Go to Menus</Button>
    </a>
  </div>
);

export default Home;
