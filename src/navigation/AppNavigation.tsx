import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../components/Home';
import Inventory from '../components/Inventory';
import Sales from '../components/Sales';
import CashPage from '../components/CashPage';

// Certifique-se de que o caminho de importação está correto
import { RootTabParamList } from '../types/navigation'; // Caminho correto

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Inventory" component={Inventory} />
      <Tab.Screen name="Sales" component={Sales} />
      <Tab.Screen name="CashPage" component={CashPage} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
