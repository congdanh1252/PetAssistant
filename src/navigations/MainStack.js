import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SearchingScreen from '../screens/SearchingScreen';
import PetStack from '../components/PetStack';
import GuideStack from '../components/GuideStack';
import { Schedules } from '../screens/Schedules';
import { ExpenditureScreen } from '../screens/ExpenditureScreen';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <>
      <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{
              animation: 'slide_from_right'
            }}
          >
              <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
              <Stack.Screen name="MyPets" component={PetStack} options={{headerShown: false}}/>
              <Stack.Screen name="Guides" component={GuideStack} options={{headerShown: false}}/>
              <Stack.Screen name="Schedules" component={Schedules} options={{headerShown: false}}/>
              <Stack.Screen name="Expenditure" component={ExpenditureScreen} options={{headerShown: false}}/>
              <Stack.Screen name="Searching" component={SearchingScreen} options={{headerShown: false}}/>
          </Stack.Navigator>
      </NavigationContainer>
      <Toast/>
    </>
  );
}

export default MainStack;