import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ínicio from '../components/Ínicio';
import Estoque from '../components/Estoque';
import Vendas from '../components/Vendas';
import Caixa from '../components/Caixa';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


import { RootTabParamList } from '../types/navigation'; 

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Ínicio">
      <Tab.Screen
        name="Ínicio"
        component={Ínicio}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Estoque"
        component={Estoque}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons name="storage" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Vendas"
        component={Vendas}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign name="areachart" size={24} color="black" /> 
          ),
        }}
      />
      <Tab.Screen
        name="Caixa"
        component={Caixa}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome6 name="cash-register" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
