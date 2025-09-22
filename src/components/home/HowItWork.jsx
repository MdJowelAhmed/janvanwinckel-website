import React from "react";
import {
  CheckMarkSvg,
  Database,
  FriendShip,
  PigeonSvg,
} from "../share/svg/howItWorkSvg";

const HowItWork = () => {
  return (
    <div className="my-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-semibold mb-4">
          {" "}
          <span className="text-[#37B7C3]">How</span> It Work
        </h1>
        <p className="mb-12 text-[#909090] text-center">

          Our mission is to make pigeon management simple, smart, and reliable.
          From maintaining pedigrees to tracking race results, we provide
          powerful tools to help you organize and showcase{" "}
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-28">
        <div className="w-full mx-auto m-2 text-center">
          <div className="flex justify-center items-center w-full  mb-4">
            <Database className=""  />
          </div>
          <p className=" text-[12px] text-[#071952]">Cloud Based Database Structure</p>
        </div>
        <div className="w-full mx-auto m-2 text-center ">
          <div className="text-center flex relative justify-center items-center mb-4">
            <CheckMarkSvg className=""  />
            <div  className="absolute -bottom-4 -top-1 right-17 transform "  ><CheckMarkSvg/></div>
          </div>
          <p className=" text-[12px] text-[#071952]">Import the Data from other Pedigree Softwares</p>
        </div>
        <div className="w-full mx-auto m-2 text-center">
          <div className="flex justify-center items-center w-full  mb-4">
            <FriendShip  />
          </div>
          <p className=" text-[12px] text-[#071952]">Gain access to a public database of racing pigeon pedigrees and race results.</p>
        </div>
        <div className="w-full mx-auto m-2 text-center">
          <div className="flex justify-center items-center w-full  mb-4">
            <PigeonSvg  />
          </div>
          <p className=" text-[12px] text-[#071952]">Pigeon Race Pedigree Diagram Set</p>

        </div>
      </div>
    </div>
  );
};

export default HowItWork;
