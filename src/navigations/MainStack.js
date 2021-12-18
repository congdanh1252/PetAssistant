import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';

import PetStack from '../components/PetStack';
import ScheduleStack from '../navigations/ScheduleStack';
import ExpenditureStack from '../navigations/ExpenditureStack';
import PredictStack from '../navigations/PredictStack'

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            animation: 'slide_from_right'
          }}
        >
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="MyPets" component={PetStack} options={{headerShown: false}}/>
            <Stack.Screen name="ScheduleStack" component={ScheduleStack} options={{headerShown: false}}/>
            <Stack.Screen name="ExpenditureStack" component={ExpenditureStack} options={{headerShown: false}}/>
            <Stack.Screen name="PredictStack" component={PredictStack} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStack;