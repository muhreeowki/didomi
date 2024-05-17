"use client";
import { Oval } from "react-loader-spinner";
export default function Loading() {
  return (
    <main className="w-full h-screen flex flex-row items-center justify-center">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="hsla(198,100%,68%,1) "
        secondaryColor="hsla(189,100%,80%,1)"
        strokeWidth={5}
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </main>
  );
}
