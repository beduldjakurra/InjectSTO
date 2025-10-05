'use client';

import { useProductionStore } from '@/store/productionStore';
import { Button } from '@/components/ui/button';

export default function NavigationButtons() {
  const { currentView, setCurrentView } = useProductionStore();

  const handlePrevious = () => {
    if (currentView === 'second') {
      setCurrentView('main');
    } else if (currentView === 'third') {
      setCurrentView('second');
    }
  };

  const handleNext = () => {
    if (currentView === 'main') {
      setCurrentView('second');
    } else if (currentView === 'second') {
      setCurrentView('third');
    } else if (currentView === 'third') {
      setCurrentView('main');
    }
  };

  const getNextButtonText = () => {
    if (currentView === 'main') return 'Selanjutnya';
    if (currentView === 'second') return 'Selanjutnya';
    return 'Kembali ke Awal';
  };

  const getNextButtonClass = () => {
    if (currentView === 'third') {
      return 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
    }
    return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
  };

  return (
    <div className="flex justify-between p-6">
      <Button
        variant="outline"
        onClick={handlePrevious}
        className={`${
          currentView === 'main' ? 'invisible' : ''
        } bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-0.5`}
      >
        <i className="fas fa-arrow-left mr-2" />
        Kembali
      </Button>
      
      <Button
        onClick={handleNext}
        className={`${getNextButtonClass()} text-white shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-0.5`}
      >
        {getNextButtonText()}
        <i className="fas fa-arrow-right ml-2" />
      </Button>
    </div>
  );
}