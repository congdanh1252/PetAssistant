import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScheduleEvent } from '../screens/ScheduleEvent';
import { Schedules } from '../screens/Schedules';


const Stack = createNativeStackNavigator();

const ScheduleStack = () => {
  return (
    <Stack.Navigator 
        screenOptions={{
        animation: 'slide_from_right'
        }}
    >
        <Stack.Screen name="Schedules" component={Schedules} options={{headerShown: false}}/>
        <Stack.Screen name="ScheduleEvent" component={ScheduleEvent} options={{headerShown: false}}/> 
    </Stack.Navigator>
  );
}

export default ScheduleStack;