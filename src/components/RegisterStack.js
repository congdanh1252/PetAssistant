import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RegisterScreen_1, RegisterScreen_2 } from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export function RegisterStack() {
  return (
    // <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            animation: 'slide_from_right'
          }}
        >
            <Stack.Screen name="Register1" component={RegisterScreen_1} options={{headerShown: false}}/>
            <Stack.Screen name="Register2" component={RegisterScreen_2} options={{headerShown: false}}/>
        </Stack.Navigator>
    // </NavigationContainer>
  );
}