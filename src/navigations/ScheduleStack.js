import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Schedules } from '../screens/Schedules';
import { AddScheduleScreen } from '../screens/AddScheduleScreen';


const Stack = createNativeStackNavigator();

const ScheduleStack = () => {
  return (
    <Stack.Navigator 
        screenOptions={{
        animation: 'slide_from_right'
        }}
    >
        <Stack.Screen name="Schedules" component={Schedules} options={{headerShown: false}}/>
        <Stack.Screen name="AddScheduleScreen" component={AddScheduleScreen} options={{headerShown: false}}/> 
        
    </Stack.Navigator>
  );
}

export default ScheduleStack;