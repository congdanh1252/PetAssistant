import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PetStack from '../components/PetStack';
import { Schedules } from '../screens/Schedules';
import { ExpenditureScreen } from '../screens/ExpenditureScreen';


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
            <Stack.Screen name="Schedules" component={Schedules} options={{headerShown: false}}/>
            <Stack.Screen name="Expenditure" component={ExpenditureScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStack;