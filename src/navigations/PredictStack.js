import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PredictScreen } from '../screens/PredictScreen';
import { PredictDetailsScreen } from '../screens/PredictDetailsScreen';


const Stack = createNativeStackNavigator();

const PredictStack = () => {
  return (
    <Stack.Navigator 
        screenOptions={{
            animation: 'slide_from_right'
        }}
    >
        <Stack.Screen name="Predict" component={PredictScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PredictDetail" component={PredictDetailsScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

export default PredictStack;