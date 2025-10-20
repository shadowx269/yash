import { CATEGORIES } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Sparkles, Filter } from 'lucide-react';

interface CategoryChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryChips = ({ selectedCategory, onSelectCategory }: CategoryChipsProps) => {
  return (
    <div className="w-full animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 sm:h-10 sm:w-1.5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold text-foreground">
            Shop by Category
          </h2>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold text-primary">Filter</span>
        </div>
      </div>

      {/* Enhanced Category Chips */}
      <div className="relative">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-3 sm:-mx-4 px-3 sm:px-4">
          {CATEGORIES.map((category, index) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectCategory(category)}
              className={`
                whitespace-nowrap rounded-full px-4 sm:px-6 py-2 transition-all duration-300 
                snap-start shadow-sm relative overflow-hidden group
                ${selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105'
                  : 'hover:scale-105 hover:shadow-md border-primary/20 hover:border-primary/40'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fade-in 0.5s ease-out forwards'
              }}
            >
              {/* Active indicator */}
              {selectedCategory === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
              )}

              {/* Category text */}
              <span className="relative z-10 font-medium text-xs sm:text-sm">
                {category}
              </span>

              {/* Sparkle effect for selected */}
              {selectedCategory === category && (
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-white animate-pulse" />
              )}
            </Button>
          ))}
        </div>

        {/* Gradient fade edges */}
        <div className="absolute top-0 left-0 w-8 sm:w-16 h-full bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 sm:w-16 h-full bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};
