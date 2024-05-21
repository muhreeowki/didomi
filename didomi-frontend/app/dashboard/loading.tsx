"use client";
import { Oval } from "react-loader-spinner";
export default function Loading() {
  return (
    <main className="w-full h-full flex flex-row items-center justify-center">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="hsla(0,0%,30%,1) "
        secondaryColor="hsla(0,0%,70%,1)"
        strokeWidth={5}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </main>
  );
}
