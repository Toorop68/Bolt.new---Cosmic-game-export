import React, { useState } from 'react';
import { Book, ChevronDown, ChevronUp } from 'lucide-react';
import { LegendItem } from '../types';

interface LegendProps {
  items: LegendItem[];
}

interface CategoryGroup {
  name: string;
  items: LegendItem[];
}

export const Legend: React.FC<LegendProps> = ({ items }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['hazards']));

  const categories: CategoryGroup[] = [
    { name: 'planets', items: items.filter(i => i.category === 'planets') },
    { name: 'ships', items: items.filter(i => i.category === 'ships') },
    { name: 'hazards', items: items.filter(i => i.category === 'hazards') },
    { name: 'factions', items: items.filter(i => i.category === 'factions') },
    { name: 'freighters', items: items.filter(i => i.category === 'freighters') }
  ].filter(cat => cat.items.length > 0);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Book className="text-blue-400" />
        <h2 className="text-lg font-bold">Legend</h2>
      </div>

      <div className="space-y-2">
        {categories.map(category => {
          const isExpanded = expandedCategories.has(category.name);
          const discoveredCount = category.items.filter(i => i.discovered).length;
          const totalCount = category.items.length;

          return (
            <div key={category.name} className="bg-gray-700/50 rounded overflow-hidden">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full p-2 text-left flex items-center justify-between"
              >
                <span className="capitalize font-bold">
                  {category.name} ({discoveredCount}/{totalCount})
                </span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {isExpanded && (
                <div className="px-2 pb-2 space-y-1">
                  {category.items.map(item => (
                    <div
                      key={item.id}
                      className={`p-2 rounded text-sm ${
                        item.discovered
                          ? 'bg-gray-600/50'
                          : 'bg-gray-700/50 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={item.color}>{item.symbol}</span>
                        <span className="font-bold">{item.name}</span>
                      </div>
                      {item.discovered && (
                        <p className="text-xs text-gray-300 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};