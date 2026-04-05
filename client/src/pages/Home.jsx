// src/pages/Home.jsx
import Hero from "../components/home/Hero";
import FeaturedModels from "../components/home/FeaturedModels";
import Divisions from "../components/home/Divisions";
import LatestNews from "../components/home/LatestNews";

const Home = () => {
  return (
    <>
      <Hero />
      <FeaturedModels />
      <Divisions />
      <LatestNews />
    </>
  );
};

export default Home;
