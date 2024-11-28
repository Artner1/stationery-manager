import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initializeDatabase } from './src/utils/database';
import AppNavigator from './src/navigation/AppNavigation';
import { InventoryProvider } from './src/context/InventoryContext';
import { CashProvider } from './src/context/CashContext';
import { SalesProvider } from './src/context/SalesContext';

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <InventoryProvider>
      <CashProvider>
        <SalesProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SalesProvider>
      </CashProvider>
    </InventoryProvider>  
  );
}