import React from "react";
import {
  CheckMarkSvg,
  Database,
  FriendShip,
  PigeonSvg,
} from "../share/svg/howItWorkSvg";
import Image from "next/image";

const HowItWork = () => {
  return (
    <div className="my-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-semibold mb-4">
          {" "}
          <span className="text-[#37B7C3]">How</span> It Works
        </h1>
        <p className="mb-12 text-[#909090] text-center">
          Create pedigrees in minutes, verify your bloodlines, and share them
          worldwide.​ Simple, secure, and built for pigeon fanciers
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-28">
        <div className="w-full mx-auto m-2 text-center">
          <div className="flex justify-center items-center w-full  mb-4">
            {/* <Database className="" /> */}
            <Image
              src="/assests/work1.png"
              alt="work2"
              width={100}
              height={100}
            />
          </div>
          <p className="  sm:text-normal  text-destructive">
            Cloud-based structure to manage your pigeons online
          </p>
        </div>
        <div className="w-full mx-auto m-2 text-center ">
          {/* <div className="text-center flex relative justify-center items-center mb-4">
            <CheckMarkSvg className="" />
            <div className="absolute -bottom-4 -top-1 right-17 transform ">
              <CheckMarkSvg />
            </div>
          </div> */}
          <div className="flex justify-center items-center w-full  mb-4">
            <Image
              src="/assests/work2.png"
              alt="work2"
              width={100}
              height={100}
            />
          </div>
          <p className="  sm:text-normal  text-destructive">
            Select from a database of iconic pigeons
          </p>
        </div>
        <div className="w-full mx-auto m-2 text-center">
          <div className="flex justify-center items-center w-full  mb-4">
            {/* <FriendShip /> */}
            <Image
              src="/assests/work3.png"
              alt="work3"
              width={100}
              height={100}
            />
          </div>
          <p className="  sm:text-normal  text-destructive">
            Gain access to a database of verified pigeons and breeders
          </p>
        </div>
        <div className="w-full mx-auto m-2 text-center">
          <div className="flex justify-center items-center w-full  mb-4">
            {/* <PigeonSvg /> */}
            <Image
              src="/assests/work5.png"
              alt="work4"
              width={100}
              height={100}
            />
          </div>
          <p className="  sm:text-normal  text-destructive">
            Generate a 4 or 5 generation pedigree within minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
