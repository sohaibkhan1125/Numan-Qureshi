import React from 'react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ToolsGrid from '../components/ToolsGrid';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <main>
        <Hero />
        <CategorySection />
        <ToolsGrid />
        <WhyChooseUs />
    </main>
  );
};

export default Home;
