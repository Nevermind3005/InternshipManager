import { Plus } from 'lucide-react';

interface IFabProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick } : IFabProps) => {
    return (
    // Main wrapper for positioning (fixed bottom right)
        <div className="fixed bottom-6 right-6 z-50">
      
            {/* Primary Floating Action Button */}
            <button
                onClick={onClick}
                className={`
          relative z-50 w-14 h-14 rounded-full shadow-2xl
          bg-primary text-primary-foreground
          flex items-center justify-center
          transition-all duration-200 ease-in-out
          hover:bg-primary/90 active:scale-95
        `}
                aria-label="Perform primary action"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default FloatingActionButton;