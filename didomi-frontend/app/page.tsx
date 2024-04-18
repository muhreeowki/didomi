import CallToAction from "@/components/CallToAction";
import Discover from "@/components/Discover";
import LandingNavbar from "@/components/LandingNavbar";

const Home = () => {
  return (
    <>
      <LandingNavbar />
      <main className="container realtive">
        <div className="mt-5 text-center">
          <h1 className="scroll-m-20 text-7xl md:text-8xl font-semibold tracking-wider lg:text-9xl ">
            DIDOMI FUND
          </h1>
          <p className="leading-7 tracking-wide mt-2 ml-1 font-medium md:text-lg text-md">
            The future of Crypto Crowdfunding and Charity
          </p>
        </div>
        <Discover />
        <CallToAction />
      </main>
    </>
  );
};

export default Home;
