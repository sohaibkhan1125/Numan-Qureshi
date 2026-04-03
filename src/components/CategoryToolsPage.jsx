import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Same layout as PdfTools: hero + search, optional featured row, full grid.
 * Accent colors passed as full Tailwind class strings so they compile.
 */
const CategoryToolsPage = ({
  title,
  subtitle,
  searchPlaceholder,
  categoryLabel,
  accentBarClass,
  cardTitleHoverClass,
  searchIconClass,
  inputFocusClassName,
  tools,
  featuredToolNames = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const toolsWithFeatured = useMemo(
    () =>
      tools.map((t) => ({
        ...t,
        featured: featuredToolNames.includes(t.name),
      })),
    [tools, featuredToolNames]
  );

  const filteredTools = toolsWithFeatured.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredTools = toolsWithFeatured.filter((tool) => tool.featured);

  return (
    <div className="bg-slate-50/10 min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">{title}</h1>
        <p className="text-slate-500 font-medium text-[15px] mb-12">{subtitle}</p>

        <div className="max-w-xl mx-auto mb-12 relative">
          <div
            className={`relative flex items-center p-1.5 bg-white border border-slate-200 rounded-full shadow-[0_15px_30px_-15px_rgba(0,0,0,0.1)] transition-all overflow-hidden ${inputFocusClassName}`}
          >
            <div className="pl-6 pr-3">
              <svg
                className={searchIconClass}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 py-3 text-slate-600 font-medium border-none focus:ring-0 outline-none placeholder:text-slate-400 text-[15px]"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-24 relative z-10">
        {!searchQuery && featuredTools.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-1.5 h-8 rounded-full ${accentBarClass}`} />
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Featured Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool, idx) => (
                <Link
                  key={idx}
                  to={tool.path}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 group"
                >
                  <div
                    className={`w-14 h-14 ${tool.bgColor} rounded-2xl flex items-center justify-center ${tool.iconColor} mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <div className="w-7 h-7">{tool.icon}</div>
                  </div>
                  <h3
                    className={`text-lg font-black text-slate-800 mb-2 transition-colors ${cardTitleHoverClass}`}
                  >
                    {tool.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-1.5 h-8 rounded-full ${accentBarClass}`} />
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {searchQuery ? `Search Results (${filteredTools.length})` : `All ${categoryLabel}`}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {filteredTools.map((tool, idx) => (
              <Link
                key={idx}
                to={tool.path}
                className="bg-white p-5 rounded-2xl border border-slate-100/80 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col gap-3 min-h-[140px]"
              >
                <div className="flex flex-row items-center gap-4">
                  <div
                    className={`shrink-0 w-11 h-11 ${tool.bgColor} rounded-xl flex items-center justify-center ${tool.iconColor} shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <div className="w-5 h-5">{tool.icon}</div>
                  </div>
                  <div className="flex flex-col pr-2">
                    <h4
                      className={`text-[15px] font-bold text-slate-800 leading-tight transition-colors line-clamp-1 ${cardTitleHoverClass}`}
                    >
                      {tool.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wide">
                      {categoryLabel}
                    </span>
                  </div>
                </div>
                <p className="text-[#8492a6] text-[13px] leading-relaxed font-medium line-clamp-2 pr-2">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryToolsPage;
