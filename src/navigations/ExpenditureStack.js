import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExpenditureScreen } from '../screens/ExpenditureScreen';
import { StatisticScreen } from '../screens/StatisticScreen';


const Stack = createNativeStackNavigator();

const ExpenditureStack = () => {
  return (
    <Stack.Navigator 
        screenOptions={{
            animation: 'slide_from_right'
        }}
    >
        <Stack.Screen name="Expenditure" component={ExpenditureScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Statistic" component={StatisticScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

export default ExpenditureStack;