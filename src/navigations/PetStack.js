import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPetsScreen from '../screens/MyPetsScreen';
import AddPetScreen from '../screens/AddPetScreen';
import PetProfileScreen from '../screens/PetProfileScreen';
import HealthBookScreen from '../screens/HealthBookScreen';
import AddVaccineScreen from '../screens/AddVaccineScreen';

const Stack = createNativeStackNavigator();

const PetStack = () => {
  return (
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MyPet" component={MyPetsScreen} options={{headerShown: false}}/>
        <Stack.Screen name="AddPet" component={AddPetScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PetProfile" component={PetProfileScreen} options={{headerShown: false}}/>
        <Stack.Screen name="HealthBook" component={HealthBookScreen} options={{headerShown: false}}/>
        <Stack.Screen name="AddVaccine" component={AddVaccineScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
  );
}

export default PetStack;