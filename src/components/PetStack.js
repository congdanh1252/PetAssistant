import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPetsScreen from '../screens/MyPetsScreen';
import AddPetScreen from '../screens/AddPetScreen';
import PetProfileScreen from '../screens/PetProfileScreen';

import GuideListScreen from '../screens/GuideListScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';

const Stack = createNativeStackNavigator();

const PetStack = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MyPet" component={MyPetsScreen} options={{headerShown: false}}/>
        <Stack.Screen name="AddPet" component={AddPetScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PetProfile" component={PetProfileScreen} options={{headerShown: false}}/>

        {/* <Stack.Screen name="GuideList" component={GuideListScreen} options={{headerShown: false}}/>
        <Stack.Screen name="GuideDetail" component={GuideDetailScreen} options={{headerShown: false}}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default PetStack;