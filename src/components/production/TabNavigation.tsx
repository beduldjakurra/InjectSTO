'use client';

import { useProductionStore } from '@/store/productionStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductionTable from './ProductionTable';
import BoxCalculationTable from './BoxCalculationTable';
import StockStrengthTable from './StockStrengthTable';

export default function TabNavigation() {
  const { currentView, setCurrentView } = useProductionStore();

  const handleTabChange = (value: string) => {
    setCurrentView(value as 'main' | 'second' | 'third');
  };

  return (
    <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
        <TabsTrigger 
          value="main" 
          className="data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Stock Produksi
        </TabsTrigger>
        <TabsTrigger 
          value="second" 
          className="data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Perhitungan Box
        </TabsTrigger>
        <TabsTrigger 
          value="third" 
          className="data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
        >
          Kekuatan Stock
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="main" className="mt-0">
        <ProductionTable />
      </TabsContent>
      
      <TabsContent value="second" className="mt-0">
        <BoxCalculationTable />
      </TabsContent>
      
      <TabsContent value="third" className="mt-0">
        <StockStrengthTable />
      </TabsContent>
    </Tabs>
  );
}