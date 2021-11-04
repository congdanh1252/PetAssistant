import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPetsScreen from '../screens/MyPetsScreen';
import AddPetScreen from '../screens/AddPetScreen';
import PetProfileScreen from '../screens/PetProfileScreen';

const Stack = createNativeStackNavigator();

const PetStack = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            animation: 'slide_from_right'
          }}
        >
            <Stack.Screen name="MyPets" component={MyPetsScreen} options={{headerShown: false}}/>
            <Stack.Screen name="AddPet" component={AddPetScreen} options={{headerShown: false}}/>
            <Stack.Screen name="PetProfile" component={PetProfileScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default PetStack;