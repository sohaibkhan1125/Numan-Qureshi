import React, { useMemo } from 'react';
import CategoryToolsPage from '../components/CategoryToolsPage';
import { toolsCatalogData } from '../components/ToolsGrid';

const CalculatorTools = () => {
  const calculatorTools = useMemo(
    () => toolsCatalogData.filter((t) => t.category === 'Calculator Tools' && t.path),
    []
  );

  return (
    <CategoryToolsPage
      title="Explore Calculator Tools"
      subtitle="Quick math, conversions, and estimates — all your calculation needs in one place."
      searchPlaceholder="Search Calculator Tools..."
      categoryLabel="Calculator Tools"
      accentBarClass="bg-[#6366f1]"
      cardTitleHoverClass="group-hover:text-[#6366f1]"
      searchIconClass="text-[#6366f1]"
      inputFocusClassName="focus-within:border-[#6366f1] focus-within:ring-4 focus-within:ring-indigo-100"
      tools={calculatorTools}
      featuredToolNames={['Age Calculator', 'BMI Calculator', 'Percentage Calculator', 'Tip Calculator']}
    />
  );
};

export default CalculatorTools;
