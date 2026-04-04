import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ToolsGrid from '../components/ToolsGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import FAQ from '../components/FAQ';

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Gugly Mugly — Free Online Tools & Tech';
  }, []);

  return (
    <main>
        <Hero />
        <CategorySection />
        <ToolsGrid />
        <WhyChooseUs />
        <FAQ />
    </main>
  );
};

export default Home;
