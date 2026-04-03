import React, { useMemo } from 'react';
import CategoryToolsPage from '../components/CategoryToolsPage';
import { toolsCatalogData } from '../components/ToolsGrid';

const ImageTools = () => {
  const imageTools = useMemo(
    () => toolsCatalogData.filter((t) => t.category === 'Image Tools' && t.path),
    []
  );

  return (
    <CategoryToolsPage
      title="Explore Image Tools"
      subtitle="Edit, convert, and optimize images — fast, free, and in your browser."
      searchPlaceholder="Search Image Tools..."
      categoryLabel="Image Tools"
      accentBarClass="bg-[#ff9248]"
      cardTitleHoverClass="group-hover:text-[#ff9248]"
      searchIconClass="text-[#ff9248]"
      inputFocusClassName="focus-within:border-[#ff9248] focus-within:ring-4 focus-within:ring-orange-100"
      tools={imageTools}
      featuredToolNames={['AI Image Generator', 'Image Compressor', 'Image Converter', 'JPG to PNG']}
    />
  );
};

export default ImageTools;
